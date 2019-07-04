<?php

use Illuminate\Database\Seeder;
class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users')->insert([
            'username' => "-",
            'email' => env("ADMIN_EMAIL", ""),
            'password' => bcrypt(env("ADMIN_PASSWORD", "")),
            'confirmation_code' => str_random(30),
            'confirmed' => 1,
            'superuser' => 1,
            'deactivated' => 0,
            'projectpartner' => 1
        ]);


        DB::table('pilotareas')->insert([
            'name' => "pilotarea.vienna",
            'description' => "",
        ]);

        DB::table('pilotareas')->insert([
            'name' => "pilotarea.bratislava",
            'description' => "",
        ]);

        DB::table('pilotareas')->insert([
            'name' => "pilotarea.vogtland",
            'description' => "",
        ]);

        DB::table('pilotareas')->insert([
            'name' => "pilotarea.ljubljana",
            'description' => "",
        ]);

        DB::table('pilotareas')->insert([
            'name' => "pilotarea.broumov",
            'description' => "",
        ]);

        DB::table('pilotareas')->insert([
            'name' => "pilotarea.krakow",
            'description' => "",
        ]);


        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.supervision"
        ]);

        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.operator"
        ]);


        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.drilling"
        ]);


        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.service"
        ]);

        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.drills"
        ]);

        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.drilling_accessories"
        ]);

        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.chemical"
        ]);

        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.collector"
        ]);

        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.probe"
        ]);
        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.expert"
        ]);
        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.heating"
        ]);
        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.communication"
        ]);
        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.monitoring"
        ]);
        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.planning"
        ]);
        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.pumps"
        ]);
        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.legal"
        ]);
        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.trt"
        ]);
        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.software"
        ]);
        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.heating_networks"
        ]);
        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.heat_pumps"
        ]);
        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.heat_storage"
        ]);
        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.authority"
        ]);
        DB::table('professionalgroups')->insert([
            'name' => "professionalgroups.research"
        ]);

        DB::table('thematiccoverages')->insert([
            'title' => "topics.resource_mapping"
        ]);

        DB::table('thematiccoverages')->insert([
            'title' => "topics.conflicts"
        ]);

        DB::table('thematiccoverages')->insert([
            'title' => "topics.governance"
        ]);

        DB::table('thematiccoverages')->insert([
            'title' => "topics.market"
        ]);

        DB::table('thematiccoverages')->insert([
            'title' => "topics.rdtechnical"
        ]);
        DB::table('thematiccoverages')->insert([
            'title' => "topics.rdgeoscience"
        ]);
        DB::table('thematiccoverages')->insert([
            'title' => "topics.rdeconomics"
        ]);
        DB::table('thematiccoverages')->insert([
            'title' => "topics.casestudy"
        ]);
        DB::table('thematiccoverages')->insert([
            'title' => "topics.guideline"
        ]);
    }
}
