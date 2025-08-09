<?php
// models/SoapClientModel.php
class SoapClientModel
{
    protected $client;

    public function __construct()
    {
        $wsdl = "http://localhost/servidorPrueba/EventTick.wsdl";
        $this->client = new SoapClient($wsdl, ['cache_wsdl' => WSDL_CACHE_NONE]);
    }

    public function call($method, $params = [])
    {
        try {
            return $this->client->__soapCall($method, $params);
        } catch (Exception $e) {
            return null;
        }
    }
}
?>
