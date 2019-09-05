<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Storage;
use App\Body;
use App\Pilotarea;
use \gst;
use Excel;
use DB;

class GeoserverController extends Controller
{

    private $geoserver_user = "";
    private $geoserver_pwd = "";

    public function __construct() {
        $this->geoserver_user = env("GEOSERVER_USERNAME", "");
        $this->geoserver_pwd = env("GEOSERVER_PASSWORD", "");
    }

    private $Geoserver_DIR = '/var/lib/geoserver_data';
    //private $Geoserver_DIR = '/home/tomcat/tomcat/output/build/webapps/geoserver/data';
    private $rsync = 'rsync -stuz "/public/inbox/';

    /**
     * Helper function to get the correct environment (local, staging or production)
     *
     * @param  mixed $url The request URL
     *
     * @return void - Returns the URL of the request
     */
    public function getUrl($url) {
      if(strpos($url, "localhost") !== false) {
          $url = "http://localhost:80";
          $this->Geoserver_DIR = '/home/tomcat/tomcat/output/build/webapps/geoserver/data';
      } elseif(strpos($url, "stage") !== false) {
          $url = "http://api-stage.geoplasma-ce.eu";
      } else {
          $url = "https://api.geoplasma-ce.eu";
      }
      return $url;
    }

    /**
     * getLayers - makes a WMS GetCapabilities request for the given pilotarea to the Geoserver containing the GIS layers
     *
     * @param  mixed $request - Request object containing the URL params for the WMS call
     * @param  mixed $workspace - The pilot area (uri-string) for which the layers should be fetched
     *
     * @return void - Return list of layers as JSON
     */
    public function getLayers(Request $request, $workspace) {

        $url = $this->getUrl($request->url());
        $client = new Client();

        $res = $client->request('GET', $url.'/geoserver/'.$workspace.'/wms?service=wms&request=GetCapabilities&namespace='.$workspace, [
                'auth' => [$this->geoserver_user, $this->geoserver_pwd]
            ]);

        $data = $res->getBody();
        $xml = simplexml_load_string($data);

        $layernames = '';
        foreach($xml->Capability->Layer->Layer as $layer) {
            $layernames = $layernames . $workspace.':'.$layer->Name.',';
        }
        $layernames = substr($layernames, 0, -1);

        if($layernames != '') {

            $legends = [];
            $res = $client->request('GET', $url.'/geoserver/wms?request=GetStyles&service=WMS&layers='.$layernames.'&version=1.1.1', [
                'auth' => [$this->geoserver_user, $this->geoserver_pwd]
            ]);
            $data = $res->getBody();
            $xml2 = simplexml_load_string($data, null, 0, 'sld', true);
            $xml2->registerXPathNamespace('sld', 'http://www.opengis.net/sld');

            $i = 0;
            foreach($xml2->NamedLayer as $layer) {
                $legend = [];
                if($layer->UserStyle->FeatureTypeStyle->Rule->RasterSymbolizer) {
                  foreach($layer->UserStyle->FeatureTypeStyle->Rule->RasterSymbolizer->ColorMap->ColorMapEntry as $entry) {
                      $values = new \stdClass();
                      foreach($entry->attributes() as $a => $b) {
                          $values->$a = (string)$b;
                      }
                      array_push($legend, $values);
                  }
                } else {
                  
                    if(sizeOf($layer->UserStyle->FeatureTypeStyle) > 1) {
                        foreach($layer->UserStyle->FeatureTypeStyle as $entry) {
                            $values = new \stdClass();
                            if($entry->Rule[0]->PolygonSymbolizer) {
                                $temp = $entry->Rule[0]->PolygonSymbolizer->Fill->CssParameter;
                                $values->color = (string)$temp;
                                $values->quantity = (string)$entry->Rule[0]->Title;
                                $values->label = (string)$entry->Rule[0]->Name;
                            }
                            array_push($legend, $values);
                        }
                    } else {
                        foreach($layer->UserStyle->FeatureTypeStyle->Rule as $entry) {
                            $values = new \stdClass();
                            
                              if($entry->PolygonSymbolizer) {
                                  $temp = $entry->PolygonSymbolizer->Fill->CssParameter;
                                  $values->color = (string)$temp;
                                  $values->quantity = (string)$entry->Title;
                                  $values->label = (string)$entry->Name;
                              }
                              if($entry->PointSymbolizer) {
                                  $temp = $entry->PointSymbolizer->Graphic->Mark->Fill->CssParameter;
                                  $values->color = (string)$temp;
                                  $values->quantity = (string)$entry->Title;
                              }
      
                              if($entry->LineSymbolizer) {
                                  $temp = $entry->LineSymbolizer->Stroke->CssParameter;
                                  $values->color = (string)$temp;
                                  $values->quantity = (string)$entry->Name;
                              }       
                            array_push($legend, $values);
                        }
                    }
                }
                array_push($legends, $legend);
            }


            $i = 0;
            $response = [];

            foreach($xml->Capability->Layer->Layer as $layer) {

                $json = json_encode($layer);
                $json = json_decode($json);


                $json->legend = $legends[$i];
                array_push($response, $json);
                $i++;
            }
        }
        else { $response = []; }
        return response()->json($response);

    }

    /**
     * locationQuery 
     * Function makes a WMS GetFeatureInfo request for a location query to the Geoserver containing the GIS layers
     * The link parameter contains the parameters for the WMS request, including the requested location and the requested layer
     * Fore more details on the Link parameter check the handleClick() function in frontend/components/webgis/reboot/subcomponents/Map.js
     * and the featureRequest() function in frontend/components/webgis/helper.js
     * This function is meant to query only a single layer via the WMS request
     *
     * @param  mixed $request - Request object containing the URL params for the WMS call
     *
     * @return void
     */
    public function locationQuery(Request $request) {

        $link = $request->json('link');
        $url = $this->getUrl($request->url());
        $client = new Client();

        $res = $client->request('GET', $url.'/geoserver/wms?request=GetFeatureInfo&service=WMS&'.$link, [
                'auth' => [$this->geoserver_user, $this->geoserver_pwd]
            ]);

        // Parse the response from the WMS request
        $data = $res->getBody();
        $json = json_decode($data);

        if(sizeOf($json->features) > 0) {
            // -2 because of pilot areas outline layer
            $lastElement = sizeOf($json->features) - 2;
            
            if((isset($json->features[$lastElement]->properties->value)) && (is_float($json->features[$lastElement]->properties->value))) {
                $json->features[$lastElement]->properties->value = round($json->features[$lastElement]->properties->value, 2);
            }

            foreach ($json->features[$lastElement]->properties as $k => $v) {
                $value = $v;
                break;
            }

            $result = [
                'data' => 'locationquery',
                'status' => true,
                'message' => $v
            ];
        } else {
            $result = [
                'data' => 'locationquery',
                'status' => false,
                'message' => '-'
            ];
        }
        return response()->json($result);
    }

    /**
     * reportQuery
     * Function makes a WMS GetFeatureInfo request for the reports in the GeoPLASMA-CE web GIS to the Geoserver which contains the GIS layers
     * The link parameter contains the parameters for the WMS request, including the requested location and the requested layers
     * Fore more details on the Link parameter check the handleClick() function in frontend/components/webgis/reboot/subcomponents/Map.js
     * and the featureRequest() function in frontend/components/webgis/helper.js
     * This function is meant to query all layers that should be displayed in the reports, including traffic light maps, conflict maps
     * and potential maps. The layers parameter in the request contains a list of the layers that will be included in the report.
     *
     * @param  mixed $request - Request object containing the URL params for the WMS call
     *
     * @return void
     */
    public function reportQuery(Request $request) {
      $url = $this->getUrl($request->url());
        $layers = $request->json('layers');
        $area = $request->json('area');
        $link = $request->json('link');

        $client = new Client();
        $res = $client->request('GET', $url.'/geoserver/'.$area.'/wms?request=GetFeatureInfo&service=WMS&'.$link, [
                'auth' => [$this->geoserver_user, $this->geoserver_pwd]
            ]);

        // Parse the response from the WMS request
        $data = $res->getBody();
        $json = json_decode($data);

        $responses = [];
        $responses["conflicts"] = [];
        $responses["non_conflict"] = [];
        $responses["traffic_light_maps"] = [];
        
        // This is needed when a requested layer (a vector layer) has no value at the queried location
        if(sizeOf($json->features) != sizeOf($layers)) {
            $filteredLayers = [];
            $counter = 0;
            $features = [];
            $adds = [];
            $i = 0;
            foreach($layers as $layer) {
                $add = 1;
                if($layer['resource_format'] == 'Shape') {
                    $exists = false;
                    
                    foreach($json->features as $feature) {
                        $id = explode(".", $feature->id)[0];
                        if($id == $layer["uri"]) {
                            $exists = true;
                            $duplicate = false;
                            $index = 0;
                            foreach($features as $feat) {
                                if(explode(".", $feat->id)[0] === $id) {
                                    $duplicate = true;
                                    break;
                                }
                                $index++;
                            }
                            if(!$duplicate) {
                                array_push($features, $feature);
                                $index++;
                            } else {
                                if((isset($feature->properties->conflict)) && ($feature->properties->conflict > $features[$index]->properties->conflict)) {
                                    $features[$index]->properties->conflict = $feature->properties->conflict;
                                }
                                if((isset($feature->properties->traffic_va)) && ($feature->properties->traffic_va > $features[$index]->properties->traffic_va)) {
                                    $features[$index]->properties->traffic_va = $feature->properties->traffic_va;
                                }
                                $add = $add + 1;
                            }
                        }
                    }
                    if($exists) {
                        $layer["index"] = $i;
                        array_push($filteredLayers, $layer);
                    } else {
                        $add = 0;
                    }
                } else {
                    $layer["index"] = $i;
                    array_push($filteredLayers, $layer);
                    array_push($features, $json->features[$i]);
                }
                $i = $i + $add;
                array_push($adds, $add);
            }
            $layers = $filteredLayers;
        } else {
            $features = $json->features;
        }

        // Create the response object for each queried layer based on the list of layers given 
        // to this function and the response from the WMS request
        if(sizeOf($features) > 0) {
            $i = 0;
            foreach($features as $feature) {
                
                $temp = [];
                $temp['layer'] = $layers[$i]['name'];
                $temp['language1'] = $layers[$i]['language1'];
                $temp['language2'] = $layers[$i]['language2'];
                $temp['is_open_loop_tlm'] = $layers[$i]['traffic_light_map_open_loop'];
                $temp['short_description'] = $layers[$i]['short_description'];
                $temp['is_closed_loop_tlm'] = $layers[$i]['traffic_light_map_closed_loop'];
                $temp['category'] = $layers[$i]['variable_type_of_cell_related_parameter'];
                // If it is a traffic light map, get the label for the value for showing the text in the reports
                if(($temp['is_open_loop_tlm']) || ($temp['is_closed_loop_tlm'])) {
                    foreach($layers[$i]["legend"] as $legend) {
                        $value = isset($feature->properties->value) ? $feature->properties->value : $feature->properties->traffic_va;
                        if($legend["quantity"] == $value) {
                            $temp["label"] = $legend["label"];
                        }
                    }
                }

                if(array_key_exists('parent', $layers[$i])) {
                    $temp['parent'] = $layers[$i]['parent'];
                }

                $temp["key"] = $layers[$i]['key'];
                $temp["group_key"] = $layers[$i]['group_key'];
                $temp["unit_of_cell_related_parameter"] = $layers[$i]['unit_of_cell_related_parameter'];
                $temp["value_of_object_related_parameter_1"] = $layers[$i]['value_of_object_related_parameter_1'];
                
                if($layers[$i]['conflicts'] != false) {
                    $colors = [];
                    // Get the traffic light maps colors
                    foreach($layers as $layer) {

                        if(($layer["traffic_light_map_open_loop"] == true) || ($layer["traffic_light_map_closed_loop"] == true)) {

                            foreach($layer["legend"] as $legend) {
                                $colors["color_".$legend["quantity"]] = $legend["color"];
                            }
                            break;
                        }
                    }
                    
                    foreach($layers[$i]['conflicts'] as $conflict) {
                        $temp['traffic_light_map_open_loop'] = $colors["color_1"];
                        $temp['traffic_light_map_closed_loop'] = $colors["color_1"];
                        $value = isset($feature->properties->value) ? $feature->properties->value : $feature->properties->conflict;
                        if($conflict["category_on_the_conflict_map"] == $value) {
                            $temp['explanatory_text'] = [];
                            $temp['explanatory_text']['English'] = $conflict["explanatory_text_en"];
                            $temp['explanatory_text'][$temp['language1']] = $conflict["explanatory_text_national_language_1"];
                            $temp['explanatory_text'][$temp['language2']] = $conflict["explanatory_text_national_language_2"];
                            $temp['traffic_light_map_open_loop'] =  isset($conflict["category_on_the_traffic_light_map_open_loop"]) ? $colors["color_".$conflict["category_on_the_traffic_light_map_open_loop"]] : 1;
                            $temp['traffic_light_map_closed_loop'] = isset($conflict["category_on_the_traffic_light_map_closed_loop"]) ? $colors["color_".$conflict["category_on_the_traffic_light_map_closed_loop"]] : 1;

                            if($conflict["explanatory_text_national_language_1"] != null) {
                                $temp['hide'] = false;
                            } else {
                                $temp['hide'] = false;
                            }
                            break;
                        }
                    }
                    $temp["legend"] = [];
                    
                    foreach($layers[$i]['legend'] as $legend) {
                        $value = isset($feature->properties->value) ? $feature->properties->value : $feature->properties->conflict;
                        
                        if($legend['quantity'] == $value) {
                            if(array_key_exists('labels', $legend)) {
                                $temp["legend"]["label"] = $legend["labels"];
                                break;
                            }

                            $temp["legend"]["color"] = $legend["color"];
                        } else {
                            $temp["legend"]["label"] = false;
                        }
                    }
                } else {
                    foreach($layers[$i]['legend'] as $entry) {
                        
                        $value = isset($feature->properties->value) ? $feature->properties->value : (isset($feature->properties->conflict) ? $feature->properties->conflict : $feature->properties->traffic_va);
                        if($entry['quantity'] == $value) {
                            $temp['color'] = $entry['color'];
                            break;
                        }
                    }
                }
                $temp['value'] = $value;

                if($layers[$i]['report']) {
                    if($layers[$i]['conflicts'] != false) {
                        if($layers[$i]['parent'] != "conflict map") {
                            array_push($responses["non_conflict"], $temp);
                        }
                        else {
                            if($temp['value'] != -9999) {
                                array_push($responses["conflicts"], $temp);
                            }
                        }
                        
                    } elseif (($temp['is_open_loop_tlm']) || ($temp['is_closed_loop_tlm'])) {
                        $temp['legend'] = $layers[$i]['legend'];
                        array_push($responses["traffic_light_maps"], $temp);
                    } else {
                        if($layers[$i]['parent'] !== 'conflict map') {
                            array_push($responses["non_conflict"], $temp);
                        }
                    }
                }
                $i++;
            }
            if(sizeOf($responses["non_conflict"]) > 0) {
                $grouped = [];
                foreach($responses["non_conflict"] as $layer) {
                    $layer['value'] = round($layer['value'], 2);
                    $exists = false;
                    $index = 0;
                    foreach($grouped as $group) {
                        if($group['name'] === $layer['group_key']) {
                            $exists = true;
                            array_push($grouped[$index]['children'], $layer);
                        }
                        $index++;
                    }
                    if(!$exists) {
                        $newobject = [
                            'name' => $layer['group_key'],
                            'children' => []
                        ];
                        array_push($grouped, $newobject);
                        array_push($grouped[sizeOf($grouped)-1]['children'], $layer);
                    }
                }
                $responses["non_conflict"] = $grouped;
            }
        }
        return response()->json($responses);
    }

    /**
     * readExcelFile
     * This function parses the pilot area metadata Excel file and compares its values to the
     * current state of the pilotarea on the Geoserver. It decides if:
     * - a layer will be added to the Geoserver (layer exists in metadata table but not on the geoserver)
     * - a layer will be updated on the Geoserver (layer has an updated date column in the metadata table)
     * - a layer will be removed from the Geoserver (layer exists on the Geosver but not in the metadata table)
     * The response object for each layer has a pull / push property that is given to the frontend. The user has to confirm
     * the changes that this function has noticed to start the proccess of updating the GIS layers on the Geoserver for the given pilot area
     *
     * @param  mixed $request
     * @param  mixed $returnAsObject
     *
     * @return void
     */
    public function readExcelFile(Request $request, $returnAsObject = false) {

        $workspace = $request->json('area');
        $area = Pilotarea::where('excel_identifier','=',$workspace)->first();
        $layers = [];
    
        $cmd = 'rsync --list-only /public/inbox/'.$area->uri.'/ 2>&1';
        exec($cmd, $output, $return_v);         
        $excelFound = false;
        $extension = '.xlsx';
        $files = [];
        foreach($output as $file) {
            $filename = preg_split("/([0-9][0-9]:[0-9][0-9]:[0-9][0-9])/", $file);
            $filename = substr($filename[1], 1);
            array_push($files, $filename);
            if($filename == $workspace.".xls") {
                $excelFound = true;
                $extension = ".xls";

                break;
            } else if($filename == $workspace.".xlsx") {
                $excelFound = true;
                $extension = ".xlsx";
                break;
            }
        }
        $errors = [];
        
        if(!$excelFound) {
            array_push($errors, "No excel file was found for this area.");
            $response = [];
            $response["errors"] = $errors;
            $data = [
                "status" => true,
                "data" => "metadataquery",
                "message" => $response
            ];
            return $data;
        } else {             
          // Main Excel file
          $cmd = $this->rsync.$area->uri.'/'.$workspace.$extension.'" /var/www/html/backend/storage/excel 2>&1';
          exec($cmd, $output, $return_v);

          $exists = Storage::disk('excel')->exists($workspace.$extension);
          if(!$exists) {
              array_push($errors, "An error occured while copying the excel file to the webserver.");
          }
          
          $results;
          
          $data = Excel::load('storage/excel/'.$workspace.$extension)->first();
          $rowsWithData = [];
          
          // Get the rows that contain data
          foreach($data as $key => $value) {
              if($value->pp_id != null) {
                  if($value->op_id != "Explanation")
                  array_push($rowsWithData, $value);
              }
          }
          if(sizeOf($rowsWithData) > 0) {          
              // Check if there is exactly one layer set as default
              $default = 0;
              foreach($rowsWithData as $key => $value) {


                  // Check if all required fields are filled
                  if(
                      ($value->metadata_identifieridentical_with_file_name_except_file_extension == null)
                      || ($value->country == null)
                      || ($value->pp_id == null)
                      || ($value->pilot_area == null)
                      || ($value->cell_related_parameter_annex_01_output_parameter_list == null)
                      || ($value->file_name == null)
                  ) {
                      array_push($errors, "Please fill out all required fields for the layer ".$value->metadata_identifieridentical_with_file_name_except_file_extension);
                  }
                  
                  // Check if one layer is marked as required
                  if($value->show_on_landing_page_of_the_web_service == 'show') { $default++; }

                  // Check if the actual layer file (shp or tiff) exists

                  $layerfile_exists = false;
                  foreach($files as $file) {
                      if($file === $value->file_name) {
                          $layerfile_exists = true;
                          break;
                      }
                  }
                  if(!$layerfile_exists) {
                      array_push($errors, "The file ".$value->file_name." was not found in the inbox");
                  }
              }

              if($default != 1) {
                  array_push($errors, "Exactly one layer must be set as default!");
              }
              
          // Get inspire categories
          $cmd = 'rsync -stuz "/public/pp10-giga/vogtland-w-bohemia/Inspire.xls" /var/www/html/backend/storage/excel 2>&1';
          exec($cmd, $output, $return_v);
          $exists = Storage::disk('excel')->exists('Inspire.xls');
          if(!$exists) {
              array_push($errors, "The INSPIRE-categories excel file was not found.");
          }
          $inspire_categories = Excel::load('storage/excel/Inspire.xls')->get();
          $data = [];
          $response = [];
          $response["layers"] = [];
          $response["errors"] = [];
          
          if(sizeof($errors) == 0) {      
              $i = 1;
              foreach($rowsWithData as $key => $value) {
                  $style = strtolower($value->cell_related_parameter_annex_01_output_parameter_list);
                  $style = str_replace(" ", "_",$style);
                  $style = str_replace("(", "",$style);
                  $style = str_replace(")", "",$style);
                  $style = str_replace(",", "",$style);
                  $style = str_replace("/", "",$style);

                  $tlm_open = false;
                  $tlm_closed = false;
                  if($style == 'traffic_light_map_open_loop_system') {
                      $tlm_open = true;
                  }
                  if($style == 'traffic_light_map_closed_loop_system') {
                      $tlm_closed = true;
                  }
          }

          if(sizeof($errors) == 0) {
              $i = 1;
              foreach($rowsWithData as $key => $value) {
                
                  $style = strtolower($value->cell_related_parameter_annex_01_output_parameter_list);
                  $style = str_replace(" ", "_",$style);
                  $style = str_replace("(", "",$style);
                  $style = str_replace(")", "",$style);
                  $style = str_replace(",", "",$style);
                  $style = str_replace("/", "",$style);

                  $tlm_open = false;
                  $tlm_closed = false;
                  if($style == 'traffic_light_map_open_loop_system') {
                      $tlm_open = true;
                  }
                  if($style == 'traffic_light_map_closed_loop_system') {
                      $tlm_closed = true;
                  }

                  $layer_group_key = str_replace(" ", "_",$value->layer_group);

                  // Check if it is a conflict layer by checking if there is another
                  // Excel file that has the same name as the layers filename (without the .tif extension obviously)
                  $conflict = false;

                  $inspire = null;
                  foreach($files as $file) {

                      if(($file == $value->metadata_identifieridentical_with_file_name_except_file_extension.".xls") || ($file == $value->metadata_identifieridentical_with_file_name_except_file_extension.".xlsx")) {
                          $conflict = true;
                          // It is a conflict layer, thus, the according excel file is copied
                          // and is read
                          $conflict = $this->getConflictLayerData($file, $area);
                          break;
                      }
                      $inspire = $this->getInspireData($inspire_categories, $value->cell_related_parameter_annex_01_output_parameter_list);
                  }
                      $params = [];
                      $params["filename"] = $value->file_name;
                      $params["default"] = ($value->show_on_landing_page_of_the_web_service == 'show' ? "true" : "false");
                      $params["parent"] = $value->layer_group;
                      $params["srs"] = ($value->reference_system == 'ETRS-1989, TM 33-N' ? 'EPSG:25833' : 'EPSG:25834');
                      $params["date"] = $value->date->toDateString();
                      $params["webgis"] = ($value->show_in_map_service == 'show' ? "true" : "false");
                      $params["report"] = ($value->show_in_the_location_query == 'show' ? "true" : "false");
                      $params["height"] = $i*100;
                      $params["key"] = $style;
                      $params["group_key"] = $layer_group_key;

                      $params["traffic_light_map_closed_loop"] = ($tlm_closed ? "true" : "false");
                      $params["traffic_light_map_open_loop"] = ($tlm_open ? "true" : "false");
                      $params["conflict"] = $conflict;
                      $params["inspire"] = $inspire;

                      $params["cell_related_parameter"] = $value->cell_related_parameter_annex_01_output_parameter_list;
                      $params["variable_type_of_cell_related_parameter"] = $value->variable_type_of_cell_related_parameter;
                      $params["unit_of_cell_related_parameter"] = $value->unit_of_cell_related_parameter;
                      $params["object_related_parameter_1"] = $value->object_related_parameter_1;
                      $params["unit_of_object_related_parameter_1"] = $value->unit_of_object_related_parameter_1;
                      $params["value_of_object_related_parameter_1"] = $value->value_of_object_related_parameter_1;
                      $params["object_related_parameter_2"] = $value->object_related_parameter_2;
                      $params["unit_of_object_related_parameter_2"] = $value->unit_of_object_related_parameter_2;
                      $params["value_of_object_related_parameter_2"] = $value->value_of_object_related_parameter_2;
                      $params["data_type"] = $value->data_type;
                      $params["resource_format"] = $value->resource_format;
                      $params["author"] = $value->author;

                      $params["maintainer"] = $value->maintainer;
                      $params["maintainer_e_mail"] = $value->maintainer_e_mail;
                      $params["reference_system"] = $value->reference_system;
                      $params["description_en"] = $value->description_en;
                      $params["language1"] = $value->language1;
                      $params["description_language1"] = $value->description_language1;
                      $params["language2"] = $value->language2;
                      $params["description_language2"] = $value->description_language2;

                      array_push($response["layers"], $params);
                      $i++;
              }
              $response["layers"];
              $data = [
                  "status" => true,
                  "data" => "metadataquery",
                  "message" => $response
              ];
              if($returnAsObject) {
                return $data;
              } else {
                return response()->json($data);
              }
              
          } else {
              $response["errors"] = $errors;
              $data = [
                  "status" => true,
                  "data" => "metadataquery",
                  "message" => $response
              ];
              return response()->json($data);
          }
        } else {
            $response["errors"] = $errors;
              $data = [
                  "status" => true,
                  "data" => "metadataquery",
                  "message" => $response
              ];
              return response()->json($data);
        }
}
}
    }

    /**
     * copyLayer
     * This function copies a GIS layer from the Inbox to the Geoserver via rsync.
     * It is called from the addNewLayer function in this controller for each single layer
     *
     * @param  mixed $layername - Name of the layer that will be copied
     * @param  mixed $area - Pilot area name (uri string)
     *
     * @return void
     */
    public function copyLayer($layername, $area) {

        $cmd = 'rsync --list-only /public/inbox/'.$area->uri.'/ 2>&1';
        exec($cmd, $output, $return_v);

        $layerFound = false;
        $files = [];
        foreach($output as $file) {
            $filename = preg_split("/([0-9][0-9]:[0-9][0-9]:[0-9][0-9])/", $file);
            $filename = substr($filename[1], 1);

            array_push($files, $filename);
            if($filename == $layername) {
                $layerFound = true;
                break;
            }
        }
        $output = [];
        if($layerFound) {
            if(substr($layername, -3, 3) == '.ts') {
                $cmd = $this->rsync.$area->uri.'/'.$layername.'" /var/www/html/backend/storage/models 2>&1';
                exec($cmd, $output, $return_v);

            } else {
                $cmd = $this->rsync.$area->uri.'/'.$layername.'" '.$this->Geoserver_DIR.' 2>&1';
                exec($cmd, $output, $return_v);
            }
            
            if((substr($layername, -3, 3) !== 'shp') && (substr($layername, -3, 3) !== '.ts')) {
                $cmd = 'gdaladdo -r average '.$this->Geoserver_DIR.'/'.$layername.' 2 4 8 16';
                exec($cmd, $output, $return_v);
            } else {
                $filename = substr($layername, 0, -4);
                $cmd = $this->rsync.$area->uri.'/'.$filename.'.prj" '.$this->Geoserver_DIR.' 2>&1';
                exec($cmd, $output, $return_v);

                $cmd = $this->rsync.$area->uri.'/'.$filename.'.shx" '.$this->Geoserver_DIR.' 2>&1';
                exec($cmd, $output, $return_v);

                $cmd = $this->rsync.$area->uri.'/'.$filename.'.dbf" '.$this->Geoserver_DIR.' 2>&1';
                exec($cmd, $output, $return_v);

                $cmd = $this->rsync.$area->uri.'/'.$filename.'.sbn" '.$this->Geoserver_DIR.' 2>&1';
                exec($cmd, $output, $return_v);
            }

            return true;
        }

        return false;
    }


    /** 
     * addNewLayer
     * This function is responsible for adding new layers to the Geoserver or for removing / updating them.
     * It goes through the list of given Layers. Each layer has a pull and push property to decide if a layer will be pushed
     * to the Geoserver via the copyLayer function or if it will be pulled (deleted) from the Geoserver
     * If a layer needs to be updated it will be pulled before it will be pushed with the updated version from the Inbox.
     * For each layer that gets pushed, a Geoserver layer is created via a POST Request. In the description field of the Geoserver layer,
     * most of the data for each layer is saved.
     *
     * @param  mixed $request - Request object containing the layers to be added and the pilot area
     *
     * @return void
     */
    public function addNewLayer(Request $request) {

        $geoserver = $this->getUrl($request->url());
        $workspace = $request->json("area");
        $area = Pilotarea::where('uri','=',$workspace)->first();
        $workspace = $area->uri;
        $layers = $request->json("layers");
        $modelsDeleted = false;

        foreach($layers as $data) {
            if($data["pull"]) {

                if(substr($data["filename"], -3, 3) == '.ts') {
                    $this->removeModelFromGST($data["filename"], $workspace);
                } else {
                    $client = new Client();
                    $name = explode(".",$data["filename"])[0];

                    $url = 'coveragestores';
                    if(substr($data["filename"], -3, 3) === 'shp') {
                        $url = 'datastores';
                    }

                    $res = $client->request('DELETE', $geoserver.'/geoserver/rest/layers/'.$workspace.':'.$name, [
                            'auth' => [$this->geoserver_user, $this->geoserver_pwd],
                            "headers" => ["content-type" => "application/json"]
                        ]);

                    $client = new Client();
                    $res = $client->request('DELETE', $geoserver.'/geoserver/rest/workspaces/'.$workspace.'/'.$url.'/'.$name.'?purge=none&recurse=true', [
                            'auth' => [$this->geoserver_user, $this->geoserver_pwd],
                            "headers" => ["content-type" => "application/json"]
                        ]);

                    $response = $res->getStatusCode();
                }
            }
        
            if($data["push"]) {

                // Copy the layer from the Inbox to the geoserver
                $copyfile = $this->copyLayer($data["filename"], $area);
                
                if(!$copyfile) {
                    return $data["filename"];
                    //return "no";
                    // Error handling
                }

                if(substr($data["filename"], -3, 3) == '.ts') {
                if(!$modelsDeleted) {
                    $this->removeModelFromGST($workspace);
                    $modelsDeleted = true;
                }
                
                $this->addModelToGST($data["filename"], $workspace, $data['date']);

                } else {


                //$filename = substr($data["filename"], 0, -1);
                $filename = $data["filename"];
                // Create data store
                $body = [];
                $name = explode(".",$data["filename"])[0];            

                if(substr($data["filename"], -3, 3) === 'shp') {
                    $type = "Shapefile";
                    $url = "datastores";
                    $datatype = "featuretypes";
                    $body["dataStore"] = ["name" => $name, "enabled" => true, "connectionParameters" => [ "url" => "file:".$data["filename"]], "workspace" => $workspace, "type" => $type];
                } else {
                    $type = "GeoTIFF";
                    $url = "coveragestores";
                    $datatype = "coverages";
                    $body["coverageStore"] = ["name" => $name, "enabled" => true, "url" => "file:".$filename, "workspace" => $workspace, "type" => $type];
                }

                $client = new Client();
                $res = $client->request('POST', $geoserver.'/geoserver/rest/workspaces/'.$workspace.'/'.$url, [
                        'auth' => [$this->geoserver_user, $this->geoserver_pwd],
                        'body' => json_encode($body),
                        "headers" => ["content-type" => "application/json"]
                    ]);

                $response = $res->getStatusCode();

                if($response == 201) {
                    // Create layer
                    $body = [];
                    $format = (($datatype === "coverages") ? 'coverage' : "featureType");
                    $body[$format] = [
                        "name" => $name
                     ];

                    $client = new Client();

                    $res = $client->request('POST', $geoserver.'/geoserver/rest/workspaces/'.$workspace.'/'.$url.'/'.$name.'/'.$datatype, [
                            'auth' => [$this->geoserver_user, $this->geoserver_pwd],
                            'body' => json_encode($body),
                            "headers" => ["content-type" => "application/json"]
                        ]);

                    $response = $res->getStatusCode();

                    if($response == 201) {
                        // Update layer properties
                        $body = [];
                        $format = (($datatype === "coverages") ? 'coverage' : "featureType");

                        $body[$format] = [
                            "dimensions" => [
                                "coverageDimension" => [
                                    [
                                        "name" => "value"
                                    ]
                                ]
                            ],
                            "enabled" => true,
                            "srs" => $data["srs"],
                            "title" => $data["cell_related_parameter"],
                            "abstract" => '{"default" : '.$data["default"].',
                                "conflict" : '.json_encode($data["conflict"]).',
                                "inspire" : '.json_encode($data["inspire"]).',
                                "filename" : "'.$data["filename"].'",
                                "cell_related_parameter" : "'.$data["cell_related_parameter"].'",
                                "variable_type_of_cell_related_parameter" : "'.$data["variable_type_of_cell_related_parameter"].'",
                                "unit_of_cell_related_parameter" : "'.$data["unit_of_cell_related_parameter"].'",
                                "object_related_parameter_1" : "'.$data["object_related_parameter_1"].'",
                                "unit_of_object_related_parameter_1" : "'.$data["unit_of_object_related_parameter_1"].'",
                                "value_of_object_related_parameter_1" : "'.$data["value_of_object_related_parameter_1"].'",
                                "object_related_parameter_2" : "'.$data["object_related_parameter_2"].'",
                                "unit_of_object_related_parameter_2" : "'.$data["unit_of_object_related_parameter_2"].'",
                                "value_of_object_related_parameter_2" : "'.$data["value_of_object_related_parameter_2"].'",
                                "data_type" : "'.$data["data_type"].'",
                                "resource_format" : "'.$data["resource_format"].'",
                                "author" : "'.$data["author"].'",
                                "srs" : "'.$data["srs"].'",
                                "maintainer" : "'.$data["maintainer"].'",
                                "maintainer_e_mail" : "'.$data["maintainer_e_mail"].'",
                                "reference_system" : "'.$data["reference_system"].'",
                                "description_en" : "'.$data["description_en"].'",
                                "language1" : "'.$data["language1"].'",
                                "description_language1" : "'.$data["description_language1"].'",
                                "language2" : "'.$data["language2"].'",
                                "description_language2" : "'.$data["description_language2"].'",
                                "parent" : "'.$data["parent"].'",
                                "date" : "'.$data["date"].'",
                                "webgis" : '.$data["webgis"].',
                                "report":'.$data["report"].',
                                "key": "'.$data["key"].'",
                                "group_key": "'.$data["group_key"].'",
                                "traffic_light_map_open_loop":'.$data["traffic_light_map_open_loop"].',
                                "traffic_light_map_closed_loop":'.$data["traffic_light_map_closed_loop"].',
                                "height" :'.$data["height"].'}'
                         ];

                        $client = new Client();
                        $res = $client->request('PUT', $geoserver.'/geoserver/rest/workspaces/'.$workspace.'/'.$url.'/'.$name.'/'.$datatype.'/'.$name, [
                                'auth' => [$this->geoserver_user, $this->geoserver_pwd],
                                'body' => json_encode($body),
                                "headers" => ["content-type" => "application/json"]
                            ]);

                        $response = $res->getStatusCode();

                        if($response == 200) {

                            if(($data['webgis'] == "false") && ($data['report'] == "true")) {
                                $data['key'] = $data['key'].'_report';
                            }

                            if(substr($data["filename"], -3, 3) === 'shp') {
                                $data["key"] = $data['key'].'_vector';
                            }

                            // Update style
                            $body = [];
                            $body["layer"] = [
                                "styles" => [
                                    "style" => [
                                        "name" => $data["key"]
                                    ]
                                ],
                                "defaultStyle" => [
                                    "name" => $data["key"]
                                ]
                             ];

                            $client = new Client();
                            $res = $client->request('PUT', $geoserver.'/geoserver/rest/layers/'.$workspace.':'.$name, [
                                    'auth' => [$this->geoserver_user, $this->geoserver_pwd],
                                    'body' => json_encode($body),
                                    "headers" => ["content-type" => "application/json"]
                                ]);

                            $response = $res->getStatusCode();

                        }
                    }
                }
            }
          }
        }   
        $data = [
            "status" => true,
            "data" => "copylayer",
            "message" => ""
        ];
        return $data;
    }

    /**
     * getConflictLayerData
     * This function copies the link table (just for conflict layers) for the given layer from the Inbox to this Server and
     * parses it to get the conflict data. The conflict data is saved and given as a response. This function is called 
     * from the readMetadataExcel function for each layer.
     *
     * @param  mixed $layername - Layername
     * @param  mixed $area - Pilot area uri string
     *
     * @return void
     */
    private function getConflictLayerData($layername, $area) {

        $cmd = $this->rsync.$area->uri.'/'.$layername.'" /var/www/html/backend/storage/excel 2>&1';
        exec($cmd, $output, $return_v);

        $results;
        $data = Excel::load('storage/excel/'.$layername)->first();

        $rowsWithData = [];
        $errors = [];

        // Get the rows that contain data
        foreach($data as $key => $value) {
            if($value->category_on_the_conflict_map != null) {
                array_push($rowsWithData, $value);
            }
        }

        $response = [];
        foreach($rowsWithData as $key => $value) {
            $temp = [];
            $temp["category_on_the_conflict_map"] = $value->category_on_the_conflict_map;
            $temp["category_name_en"] = $value->category_name_en;
            $temp["category_name_national_language_1"] = $value->category_name_national_language_1;
            $temp["category_name_national_language_2"] = $value->category_name_national_language_2;
            $temp["explanatory_text_en"] = (isset($value->explanatory_text_en) ? $value->explanatory_text_en : $value->comment_en);
            $temp["explanatory_text_national_language_1"] = (isset($value->explanatory_text_national_language_1) ? $value->explanatory_text_national_language_1 : $value->comment_national_language_1);
            $temp["explanatory_text_national_language_2"] = (isset($value->explanatory_text_national_language_2) ? $value->explanatory_text_national_language_2 : $value->comment_national_language_2);
            $temp["category_on_the_traffic_light_map_open_loop"] = $value->category_on_the_traffic_light_map_open_loop;
            $temp["category_on_the_traffic_light_map_closed_loop"] = $value->category_on_the_traffic_light_map_closed_loop;
            array_push($response, $temp);
        }

        return json_encode($response);

    }

    /**
     * getInspireData
     * This function gets the inspire data for a layer. It is called from the readMetadataExcel function for each
     * layer that is listed in the metadata table 
     *
     * @param  mixed $data
     * @param  mixed $keyword
     *
     * @return void
     */
    private function getInspireData($data, $keyword) {

        $whatever = [];
        $errors = [];

        // Get the rows that contain data
        foreach($data as $key => $value) {
            if($value->id != null) {
                array_push($whatever, $value);
            }
        }

        $response = [];
        foreach($whatever as $key => $value) {

            if($keyword == $value->parameter_name_en_of_cell_related_attribute) {
                $response["id"] = $value->id;
                $response["category_inspire"] = $value->category_inspire;
                $response["keyword_inspire"] = $value->keyword_inspire;
                $response["hyperlink_inspire"] = $value->hyperlink_inspire;
                $response["description_en"] = $value->description_en;
                break;
            }

        }
        return $response;
    }

    /**
     * addModelToGST
     * This function adds a Model to the GST database which is needed for the virtual boreholes that are displayed
     * in the web GIS.
     *
     * @param  mixed $filename - Filename
     * @param  mixed $workspace - Pilotarea uri string
     * @param  mixed $date - Current date
     *
     * @return void
     */
    public function addModelToGST($filename, $workspace, $date) {

        $featurename = substr($filename, 0, -3);

	    $host = env("GST_HOST", "");
        $port = env("GST_PORT", "");
	    $dbuser = env("GST_USER", "");
	    $dbpassword = env("GST_PW", "");
	    $dbname = env("GST_DB", "");
	    $type = env("GST_TYPE", "");
        $baseschema = 'gst';
        $counter = 1;
        $id = 'm_shape';
        $srs = ($workspace === 'krakow' ? 25834 : 25833);
        $path = '/var/www/html/backend/storage/models/'.$filename;

        try {

            // Establish GST connection
            $gst = new gst();
            $gst->connect($host, $port, $dbuser, $dbpassword, $dbname, $type, $baseschema, '/etc/GiGa/ssl/client.der');

            // Check if the needed SRS already exists this should only fire once ever
            $selectSRS = DB::connection('gst')->select('select * from srs where code_name = ?', [$srs]);

            if(!$selectSRS) {
                // Create new SRS manually for all pilotareas (EPSG:25833 and EPSG:25834)
                $newSrs = DB::connection('gst')->table('srs')->insert([
                    [
                        'name' => 'ETRS89 / UTM zone 33N',
                        'proj4_param' => '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs',
                        'code_type' => 'EPSG',
                        'code_name' => 25833
                    ],
                    [
                        'name' => 'ETRS89 / UTM zone 34N',
                        'proj4_param' => '+proj=utm +zone=34 +ellps=GRS80 +units=m +no_defs',
                        'code_type' => 'EPSG',
                        'code_name' => 25834
                    ]
                ]);
                // Should work now
                $selectSRS = DB::connection('gst')->select('select * from srs where code_name = ?', [$srs]);
            }

            $srs = $selectSRS[0]->id;

            // Create a feature class if none exists for this pilotarea yet
            // Set the needed variables
            $feature = DB::connection('gst')->select('select * from feature_classes where name = ?', [$workspace]);

            if(!$feature) {
                $data = [];
                $data['featureClassName'] = $workspace;
                $data['groupSelect'] = 'EVERYBODY';
                $data['srsSelect'] = '0.'.$srs;
                $data['simplexProperties'] = [];
                $data['simplexPropertyiesAlignment'] = 'VERTEX';
                $data['geometryTypeSelect'] = 'TIN';

                // Stringify and create feature class
                $string = json_encode($data);
                $gst->createFeatureClass($string);

                // Create a new entry in the geoplasma db
                $feature = DB::connection('gst')->select('select * from feature_classes where name = ?', [$workspace]);
                $body = new Body;
                $body->fcid = $feature[0]->id;
                $body->pilotarea = $workspace;
                $body->name = $workspace;
                $body->date = $date;
                $body->save();
            }

            // Get the ID of the feature class
            $feature = DB::connection('gst')->select('select * from feature_classes where name = ?', [$workspace]);
            $fcid = $feature[0]->id;

            //return '{"path" : "'.$path.'"}'; 
            // Parse metadata of the file
            $ret = $gst->parseMetadata($path, 'tin');
            //return var_dump($ret);
            
            $decoded = json_decode($ret);

            // Loop through the items to get the name and color value and upload each item as a geometry
            foreach($decoded->items as $item) {

                $name = $item->name;
                $hex = '#000000';

                $r = floor($item->r*255);
                $g = floor($item->g*255);
                $b = floor($item->b*255);
                $hex = sprintf("#%02x%02x%02x", $r, $g, $b);

                // CHECK IF MODEL ALREADY EXISTS
                $geometry = DB::connection('gst')->select('select * from geometries where name = ?', [$name]);

                // If model exists, remove it as it will be replaced
                if($geometry) {
                    // Delete feature and the model reference from the gst and the geoplasma dbs
                    $gst->deleteFeature($geometry[0]->id);
                }
                // Upload the file to the gst database and remove the file from the server
                $id = $gst->uploadFile($path, 'tin', 'EVERYBODY_pool.'.$featurename, $fcid, $id, -1, $name, '', $name, $hex, $srs, false, 0);         
            }
            Storage::disk('models')->delete($filename);
        //  ob_clean();
          return "{\"success\":true, \"metadata\": ".$id."}";

        } catch ( Exception $e) {
            error_log($e);
            $msg = mb_convert_encoding($e->getMessage(),'UTF-8');
          ob_clean();
            return "{\"error\":".json_encode($msg)."}";
        }
    }

    /**
     * removeModelFromGST
     * * This function removes a 3D model from the GST database 
     *
     * @param  mixed $workspace
     *
     * @return void
     */
    public function removeModelFromGST($workspace) {
        $host = env("GST_HOST", "");
        $port = env("GST_PORT", "");
	    $dbuser = env("GST_USER", "");
	    $dbpassword = env("GST_PW", "");
	    $dbname = env("GST_DB", "");
	    $type = env("GST_TYPE", "");
        $baseschema = 'gst';
        $body = Body::where('pilotarea','=', $workspace)->first();
        if($body) {
            $geometries = DB::connection('gst')->select('select * from geometries where feature_class = ?', [$body->fcid]);
            $feature = DB::connection('gst')->select('select * from feature_classes where id = ?', [$body->fcid]);
            $gst = new gst();
            $gst->connect($host, $port, $dbuser, $dbpassword, $dbname, $type, $baseschema, '/etc/GiGa/ssl/client.der');
            // Delete feature class etc.
            if($geometries) {
                foreach($geometries as $geometry) {
                    $gst->deleteFeature($geometry->id);
                }
            }
            if($feature) {
                $gst->deleteFeatureClass($feature[0]->name);
            }
            $body->delete();
        }
        return true;
    }

    /**
     * uploadAreas
     * This function uploads the outlines from the GeoPlasma-CE pilot areas to the Geoserver (Workspace: 'general' must exist on the Geoserver)
     *
     * @param  mixed $request
     *
     * @return void
     */
    public function uploadAreas(Request $request) {
      $url = $this->getUrl($request->url());
      $client = new Client();
      $geoserver = $this->getUrl($request->url());
      $res = $client->request('GET', $url.'/geoserver/general/wms?service=wms&request=GetCapabilities&namespace=general', [
              'auth' => [$this->geoserver_user, $this->geoserver_pwd]
          ]);

      $data = $res->getBody();
      $xml = simplexml_load_string($data);

      $areas_exist = false;

      foreach($xml->Capability->Layer->Layer as $layer) {
          if($layer->Name == 'Pilot_Areas') {
            $areas_exist = true;
            break;
          }
      }

      if($areas_exist) {
        $client = new Client();

        $res = $client->request('DELETE', $url.'/geoserver/rest/layers/general:Pilot_Areas', [
                'auth' => [$this->geoserver_user, $this->geoserver_pwd],
                "headers" => ["content-type" => "application/json"]
            ]);

        $client = new Client();

        $res = $client->request('DELETE', $url.'/geoserver/rest/workspaces/general/datastores/Pilot_Areas?purge=none&recurse=true', [
                'auth' => [$this->geoserver_user, $this->geoserver_pwd],
                "headers" => ["content-type" => "application/json"]
            ]);


        $response = $res->getStatusCode();
      }

      $cmd = $this->rsync.'Pilot_Areas.shp" '.$this->Geoserver_DIR.' 2>&1';
      exec($cmd, $output, $return_v);

      $cmd = $this->rsync.'Pilot_Areas.prj" '.$this->Geoserver_DIR.' 2>&1';
      exec($cmd, $output, $return_v);

      $cmd = $this->rsync.'Pilot_Areas.shx" '.$this->Geoserver_DIR.' 2>&1';
      exec($cmd, $output, $return_v);

      $cmd = $this->rsync.'Pilot_Areas.dbf" '.$this->Geoserver_DIR.' 2>&1';
      exec($cmd, $output, $return_v);

      $cmd = $this->rsync.'Pilot_Areas.sbn" '.$this->Geoserver_DIR.' 2>&1';
      exec($cmd, $output, $return_v);

      $type = "Shapefile";
      $url = "datastores";
      $datatype = "featuretypes";
      $body["dataStore"] = ["name" => 'Pilot_Areas', "enabled" => true, "connectionParameters" => [ "url" => "file:Pilot_Areas.shp"], "workspace" => "general", "type" => $type];

      $client = new Client();
      $res = $client->request('POST', $geoserver.'/geoserver/rest/workspaces/general/'.$url, [
              'auth' => [$this->geoserver_user, $this->geoserver_pwd],
              'body' => json_encode($body),
              "headers" => ["content-type" => "application/json"]
          ]);

      $response = $res->getStatusCode();
      if($response == 201) {
        $body = [];
        $format = "featureType";
        $body[$format] = [
            "name" => "Pilot_Areas"
         ];

        $client = new Client();

        $res = $client->request('POST', $geoserver.'/geoserver/rest/workspaces/general/'.$url.'/Pilot_Areas/'.$datatype, [
                'auth' => [$this->geoserver_user, $this->geoserver_pwd],
                'body' => json_encode($body),
                "headers" => ["content-type" => "application/json"]
            ]);

        $response = $res->getStatusCode();

        if($response == 201) {
            // Update layer properties
            $body = [];
            $format = "featureType";

            $body[$format] = [
                "dimensions" => [
                    "coverageDimension" => [
                        [
                            "name" => "value"
                        ]
                    ]
                ],
                "enabled" => true,
                "srs" => "EPSG:25833",
                "title" => "Pilot areas outline"
             ];

            $client = new Client();
            $res = $client->request('PUT', $geoserver.'/geoserver/rest/workspaces/general/'.$url.'/Pilot_Areas/'.$datatype.'/Pilot_Areas', [
                    'auth' => [$this->geoserver_user, $this->geoserver_pwd],
                    'body' => json_encode($body),
                    "headers" => ["content-type" => "application/json"]
                ]);

            $response = $res->getStatusCode();

            if($response == 200) {

                // Update style
                $body = [];
                $body["layer"] = [
                    "styles" => [
                        "style" => [
                            "name" => "line"
                        ]
                    ],
                    "defaultStyle" => [
                        "name" => "line"
                    ]
                 ];

                $client = new Client();
                $res = $client->request('PUT', $geoserver.'/geoserver/rest/layers/general:Pilot_Areas', [
                        'auth' => [$this->geoserver_user, $this->geoserver_pwd],
                        'body' => json_encode($body),
                        "headers" => ["content-type" => "application/json"]
                    ]);

                $response = $res->getStatusCode();
                return "yay";
            }
        }
      }
    }

    /**
     * boreholesRadius
     * This function makes a WMS request to the Geoserver for a radius search around the given coordinates.
     * It is meant to display how many boreholes are around the given coords in a radius of 1000 meters.
     *
     * @param  mixed $request - Request object containing the coordinates and the borehole layer id
     *
     * @return void
     */
    public function boreholesRadius(Request $request) {
        $coords = $request->json('coords');
        $layer = $request->json('boreholeLayer');

        $url = $this->getUrl($request->url());
        $client = new Client();

        $res = $client->request('GET', $url.'/geoserver/wfs?service=wfs&request=GetFeature&typeNames=walbrzych-broumov:ID10_PP0508_PA02_OP28_01&count=10&CQL_FILTER=DWITHIN(the_geom,Point('.$coords[0].' '.$coords[1].'),1000,meters)&outputFormat=JSON', [
                'auth' => [$this->geoserver_user, $this->geoserver_pwd]
            ]);
            
        $data = $res->getBody();
        return $data;
        return json_encode($data);
    }

}
