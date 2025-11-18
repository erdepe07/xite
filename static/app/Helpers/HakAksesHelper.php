<?php

namespace App\Helpers;

use CodeIgniter\Controller;

class HakAksesHelper extends Controller
{
    private $kondisimenu;
    private $hakakses;
    private $session;

    public function __construct($kondisimenu, $hakakses, $session)
    {
        $this->kondisimenu = $kondisimenu;
        $this->hakakses = $hakakses;
        $this->session = $session;
    }

    public function checkPermission()
    {
        if ($this->session == "OWNER") {
            return 1;
        }
        $menuId = isset($this->kondisimenu[0]) ? $this->kondisimenu[0] : null;
        $jsonObj = json_decode($this->hakakses);
        if ($menuId === NULL){
            return -1;
        }
        // cek khusus ha_hanyakasir
        if ($this->searchForMenu("ha_hanyakasir", $jsonObj) === 1) {
            return 3;
        }
        // cek sesuai kondisimenu[0]
        if ($menuId && $this->searchForMenu($menuId, $jsonObj) === 1) {
            return 2;
        }
        return 0;
    }
    
    private function searchForMenu($id, $jsonObject) {
        if (isset($jsonObject->menuakses)) {
            foreach ($jsonObject->menuakses as $menu) {
                if (trim(strtolower($menu->menuke)) === trim(strtolower($id))) {
                    return (int)$menu->status;
                }
            }
        } else {
            header('Location: '.base_url().'auth');
            exit(); 
        }
        return 0;
    }
     
}