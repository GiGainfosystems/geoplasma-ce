<?php

namespace App\Http\Middleware;

use App;
use Closure;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        $url = $request->url();

        if(strpos($url, "localhost") !== false) {
            $url = "http://localhost:3000";
        } elseif(strpos($url, "stage") !== false) {
            $url = "http://portal-stage.geoplasma-ce.eu";
        } else {
            $url = "https://portal.geoplasma-ce.eu";
        }

        header("Access-Control-Allow-Origin: ".$url);
  
    $headers = [
        'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS, PUT, DELETE',
        'Access-Control-Allow-Headers' => 'Content-Type, X-Auth-Token, Origin, Authorization',
        'Access-Control-Expose-Headers' => 'Authorization'
    ];
    if ($request->getMethod() == "OPTIONS") {
        // The client-side application can set only headers allowed in Access-Control-Allow-Headers
        return \Response::make('OK', 200, $headers);
    }
    $response = $next($request);
    foreach ($headers as $key => $value)
        $response->header($key, $value);
    return $response;
    }
}
