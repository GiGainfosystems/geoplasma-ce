<?php

namespace App\Http\Controllers;

use \gst;
use DB;
use App\User;
use App\Knowledgerepositorycontent;
use App\Contentcoverage;
use App\Contenttag;
use App\Event;
use App\Pilotarea;
use App\Userprofile;
use App\Gislayer;
use App\Measurement;
use App\MeasurementsLocation;
use App\Body;
use Illuminate\Http\Request;
use Excel;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Storage;

class SuperuserController extends Controller
{
    private $rsync = 'rsync -s -e "ssh -i /var/www/.ssh/id_rsa -q -o StrictHostKeyChecking=no" "pp10-giga@rsync.hidrive.strato.com:/public/inbox/';

    /**
     * loadSuperuserData
     * Function gets all the data for the administrator backend of the expert platform
     *
     * @return void
     */
    public function loadSuperuserData() {
        // Get all users from the database
        $users = User::all();
       
        // Create empty response array
        $response = [];

        // Put the data into the response array
        $response['users'] = $users;
        $response['settings'] = [];
        return response()->json($response);
    }

    /**
     * changeUserDetails
     * Function alows to change the details of a user
     *
     * @param  mixed $request
     *
     * @return void
     */
    public function changeUserDetails(Request $request) {
        // Get the user based on the ID and change the values of the model based on the request
        $user = User::find($request->json('id'));
        $user->email = $request->json('email');
        $user->username = $request->json('username');
        $user->confirmed = $request->json('confirmed');
        $user->projectpartner = $request->json('projectpartner');
        $user->deactivated = $request->json('deactivated');
        $user->save();

        // Get all users from the database
        $users = User::all();

        // Create empty response array
        $response = [];

        // Put the data into the response array
        $response['users'] = $users;
        $response['settings'] = [];
        return response()->json($response);
    }

    /**
     * removeContent
     * Remove content from the knowledge repository
     *
     * @param  mixed $request
     *
     * @return void
     */
    public function removeContent(Request $request) {
        $content = Knowledgerepositorycontent::where('id','=',$request->json("id"))->first();
        if($content) {
            $content->delete();
        }

        $contents = Knowledgerepositorycontent::all();
        $topics = Contentcoverage::all();
        $tags = Contenttag::all();

        foreach($contents as $content) {
            $topics_result = [];
            $tags_result = [];
            $id = $content->id;
            foreach($topics as $topic) {
                $t_id = $topic->content_id;
                if($id == $t_id) {
                    array_push($topics_result, $topic->coverage_id);
                }
            }
            foreach($tags as $tag) {
                $tag_id = $tag->content_id;
                if($id == $tag_id) {
                    $gettag = Tag::find($tag->tag_id);
                    $word = $gettag->tag;
                    array_push($tags_result, $word);
                }
            }
            $content->topics = $topics_result;
            $content->tags = $tags_result;
        }

        return response()->json($contents);
    }

    /**
     * uploadFieldmeasurements
     * Pull the field measurements Excel sheet from the inbox for the given pilotarea
     * Copy the excel file to the local server and put the values from it in the according
     * SQL tables for measurement locations and measurements
     *
     * @param  mixed $request
     *
     * @return void
     */
    public function uploadFieldmeasurements(Request $request) {
        $url = app('App\Http\Controllers\GeoserverController')->getUrl($request->url());
        $area = $request->json('area');
        $pilotarea = Pilotarea::find($area);

        $existing = MeasurementsLocation::where('pilotarea_id','=',$pilotarea->id)->get();
        if($existing) {
            foreach($existing as $exists) {
                $measurements = Measurement::where('object_id','=',$exists->object_id)->where('pilotarea_id','=', $pilotarea->id)->get();
                foreach($measurements as $measured) {
                    $measured->delete();
                }
                $exists->delete();
            }
        }

        $cmd = $this->rsync.'measurements/'.$pilotarea->uri.'/Locations.xlsx" /var/www/html/backend/storage/excel 2>&1';
        exec($cmd, $output, $return_v);

        $cmd = $this->rsync.'measurements/'.$pilotarea->uri.'/Measurements.xlsx" /var/www/html/backend/storage/excel 2>&1';
        exec($cmd, $output, $return_v);
        
        $exists = Storage::disk('excel')->exists('Locations.xlsx');
        if($exists) {
            if(Storage::disk('excel')->exists('Measurements.xlsx')) {
                $data = Excel::load('storage/excel/Locations.xlsx')->get();   
                foreach($data as $dat) {
                    $newdata = new MeasurementsLocation();
    
                    foreach($dat as $key => $value) {
                        if($key !== 'pa_name') {
                            $newdata[$key] = $value;
                        }
                    }
                    $newdata->pilotarea_id = $pilotarea->id;
                    $newdata->save();
                }             

                $measurements = Excel::load('storage/excel/Measurements.xlsx')->get();
                foreach($measurements as $measured) {
                    $newmeasurement = new Measurement;
                    foreach($measured as $key => $value) {
                        if($key === 'date_from' || $key === 'date_to') {
                            if($value) $value = $value->toDateString();
                        }
                        if($key === 'm_link_to_document') {
                            if($value) {
                                if($url === "http://localhost:80") {
                                    $cmd = $this->rsync.'measurements/'.$pilotarea->uri.'/raw/'.$value.'.xlsx" /var/www/html/backend/storage 2>&1';
                                } else {
                                    $cmd = $this->rsync.'measurements/'.$pilotarea->uri.'/raw/'.$value.'.xlsx" /var/www/html/content 2>&1';
                                }                                
                                exec($cmd, $output, $return_v);
                                $value = $value.'.xlsx';
                            }
                        }
                        $newmeasurement[$key] = $value;
                    }
                    $newmeasurement->pilotarea_id = $pilotarea->id;
                    $newmeasurement->save();
                }
                return app('App\Http\Controllers\MeasurementController')->getMeasurements($pilotarea->uri);
            }
        }
        return '{"error": "an error occured"}';
    }

    /**
     * removeEvent
     * Delete an event from the knowledge platform of the web portal
     *
     * @param  mixed $request
     *
     * @return void
     */
    public function removeEvent(Request $request) {
        $event = Event::where('id','=',$request->json("id"))->first();
        if($event) {
            $event->delete();
        }

        $events = Event::orderBy('date1', "asc")->get();
        return response()->json($events);
    }

    /**
     * updateArea
     * Update pilot area information
     *
     * @param  mixed $request
     *
     * @return void
     */
    public function updateArea(Request $request) {
        $area = Pilotarea::where("id",'=',$request->json("id"))->first();

        if($area) {
            $area->excel_identifier = $request->json("excel_identifier");
            $area->uri = $request->json("uri");
            $area->ne_corner = $request->json("ne_corner");
            $area->sw_corner = $request->json("sw_corner");
            $area->contact_details = $request->json("contact_details");
            $area->description_en = $request->json("description_en");
            $area->description_de = $request->json("description_de");
            $area->description_cs = $request->json("description_cs");
            $area->description_pl = $request->json("description_pl");
            $area->description_sk = $request->json("description_sk");
            $area->description_sl = $request->json("description_sl");
            $area->save();

            $areas = Pilotarea::all();
            return response()->json($areas);
        }
    }

    public function convertPoints() {
        $profiles = Userprofile::all();
        foreach($profiles as $profile) {
            $point = [$profile->lat, $profile->lon];
            $geom = "ST_Transform(ST_SetSRID(ST_MakePoint($profile->lon, $profile->lat), 4326), 4326)";
            $raw = DB::statement("UPDATE userprofiles SET location = $geom WHERE id = $profile->id");

        }

        $profiles = Userprofile::all();
        foreach($profiles as $profile) {
            //$db = DB::statement("SELECT ST_AsText(location) FROM userprofiles WHERE id = $profile->id");
            $db = DB::table('userprofiles')->select(DB::raw("ST_X(location::geometry), ST_Y(location::geometry)"))->where('id','=',$profile->id)->first();
            $profile["latitude"] = $db;
        }

        return response()->json($profiles);
    }

    /**
     * doGstStuff
     * Create the virtual borehole
     *
     * @param  mixed $request
     *
     * @return void
     */
    public function doGstStuff(Request $request) {

      $url = app('App\Http\Controllers\GeoserverController')->getUrl($request->url());
      $area = $request->json('pilotarea');
      $coordinates = $request->json('coordinates');
      $srs = $request->json('srs');

      $bodies = Body::where('name','=',$area)->first();
      
      $host = env("GST_HOST", "");
      $port = env("GST_PORT", "");
      $dbuser = env("GST_USER", "");
      $dbpassword = env("GST_PW", "");
      $dbname = env("GST_DB", "");
      $type = env("GST_TYPE", "");
      $baseschema = 'gst';

      try {
        $gst = new gst();
        $gst->connect($host, $port, $dbuser, $dbpassword, $dbname, $type, $baseschema, '/etc/GiGa/ssl/client.der');
    
        $selectSRS = DB::connection('gst')->select('select * from srs where code_name = ?', [$srs]);
        $srs = "1".$selectSRS[0]->id;

        $geometries = DB::connection('gst')->select('select id, subgeometry_of from geometries where feature_class = ?', [$bodies->fcid]);
        
        $geom_ids = [];
        foreach($geometries as $geometry) {
            if($geometry->subgeometry_of === null) {
                array_push($geom_ids, $geometry->id);
            }
        }

        $tmppath = ($url === "http://localhost:80" ? "/var/www/html/backend/storage" : "/var/www/html/content");
        $tmppathurl = ($url === "http://localhost:80" ? "http://localhost/backend/storage/" : "https://downloads.geoplasma-ce.eu/");

        $ret = $gst->createBorehole(
          //inclined
          false,
          // templateFile
          '',
          // legendTemplateFile,
          '',
          // additionalParameters,
          '{"unit" : "px", "borehole-image-width" : 1000, "borehole-image-height" : 2000, "dpi" : 100, "image-align" : "up", "borehole-y-scale-height-reference":"depth"}',
          // tmppath,
          $tmppath,
          // outputType,
          'SVG',
          // intersectionGeometry,
          $coordinates,
          // geometryFileType,
          'SFSP',
          // srs
          $srs,
          // "projectZ"
          true,
          // zMin
          500,
          // maxBoreDepth
          10000,
          // dip
          90,
          // azimut
          0,
          // overviewMap
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
          // propertySelection
          '',
          // colorMapId
          -1,
          // dynamicColorScaleId
          -1,
          // scale
          -1,
          // title
          'Geoplasma',
          // subtreeRootElement
          0,
          // csRootElement
          0,
          // csRootScale
          -1,
          // serviceId
          0,
          // tmppathurl
          $tmppathurl,
          // errortemp
          '/var/www/html/backend/storage/test.svg',
          // featureList
          json_encode($geom_ids),
          // verticalExageration
          1
        );
        $response = json_decode($ret);
        if ($response->errorCode !== 0 ) {
            $result = [
                'data' => 'borehole',
                'status' => false,
                'message' => false
            ];
        } else {
            $client = new Client(['http_errors' => false]);
            $res = $client->request('GET', $response->imageUrl);
            $statuscode = $res->getStatusCode();
            if($statuscode === 200) {
                $data = $res->getBody();
                $xml = simplexml_load_string($data);
                $string = (string)$data;
                $result = [
                    'data' => 'borehole',
                    'status' => true,
                    'message' => $string
                ];
            } else {
                $result = [
                    'data' => 'borehole',
                    'status' => false,
                    'message' => false
                ];
            }
        }
        
    }
    catch ( Exception $e) {
          $msg = mb_convert_encoding($e->getMessage(),'UTF-8');
        ob_clean();
        $result = [
            'data' => 'borehole',
            'status' => false,
            'message' => false
        ];
      }
    return $result;
}

}
