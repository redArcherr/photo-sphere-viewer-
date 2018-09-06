<?php
/**
 * Created by PhpStorm.
 * User: surfacepro
 * Date: 2018/9/4
 * Time: 17:17
 */
header("Content-type: text/html; charset=utf-8");
date_default_timezone_set("Asia/Shanghai");
$gameURL = 'http://wx.bjhci.cn/cy60year/psv_three_vr/project/';
$appid = 'wxfc3e9bc10f9226ea';
$secret = '70e1beee32d698127aad4c699552ef33';

$dsn = "mysql:host=localhost;dbname=cy60year";
$db = new PDO($dsn,'root','');
$db -> query('set names utf8');

if (isset($_GET['code'])){
    $code = $_GET['code'];
    $url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='.$appid.'&secret='.$secret.'&code='.$code.'&grant_type=authorization_code';
    $json = file_get_contents($url);
    $arr = json_decode($json,true);
    $access_token = $arr['access_token'];
    $refresh_token =$arr['refresh_token'];
    $openid = $arr['openid'];
    $time = date("Y-m-d H:i:s",time());
    $sth = $db->query("SELECT * FROM usercount WHERE openid='$openid'");
    $row = $sth->fetch();
    if($row['openid']===null){
        $count=$db->exec("INSERT INTO usercount SET openid='$openid',datatime='$time'");
    }else{
        $count=$db->exec("UPDATE usercount SET datatime='$time' WHERE openid='$openid'");
    }
    header('location:'.$gameUrl.'cy60vr.html');
}else{
    $redirect_uri = $gameURL.'login.php';
    $url='https://open.weixin.qq.com/connect/oauth2/authorize?appid='.$appid.'&redirect_uri='.$redirect_uri.'&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect';
    header('location:'.$url);
}