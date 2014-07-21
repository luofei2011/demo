<?php
/**
 * @Class
 * @description {对一串数字进行加密和解密}
 * @author luofei
 * @email {luofeihit2010@gmail.com}
 */
/*
 * 算法描述：
 * 1. 加密：
 * a)将整数值转换成32进制，补齐6位。不足的用key值随机补齐；
 * b)将整数值进行md5加密，取前6位字符。然后与32进制的6位字符串相间组合；
 * c)最后得到一个12位的字符串
 * 2. 解密：
 * a)严格按照加密的步骤逆序进行；
 * b)需要对提取出的整数再进行md5比较；
 * */
Class IDCode {
    private $key = "6Fpvr70Cs2kVoqhDWUPtQxSyJRzmndlBTu3wKcAEOI1LYgejiZbGN4X5Mf8Ha";
    private $key_arr;
    public function __construct() {
        // 第一个参数为需要进行加密或者解密的字符串
        $this->key_arr = str_split($this->key);
    }

    public function encode($num) {
        $md5_str = md5($num);
        $md5_str = substr($md5_str, 0, 6);
        $dec_to_32 = base_convert($num, 10, 32);
        $dec_to_32 = str_split($dec_to_32);
        $rnt;

        // 肯定是1-9之间的数字
        array_unshift($dec_to_32, count($dec_to_32));
        while(count($dec_to_32) < 6) {
            $rand = rand(0, 60);
            array_push($dec_to_32, $this->key_arr[$rand]);
        }

        // 最多只支持99999999(千万级)
        for($i = 0; $i < 6; $i++) {
            $rnt .= $md5_str[$i] . $dec_to_32[$i];
        }
        return $rnt;
    }

    public function decode($str) {
        $t_str = "";
        // md5的前6位字符
        $md5_6 = "";
        // 取出加密串中的有效位
        for ($i = 0, $len = strlen($str); $i < $len; $i++) {
            if ($i % 2 == 1) {
                $t_str .= $str[$i];
            } else {
                $md5_6 .= $str[$i];
            }
        }

        // 第一位存储的是长度信息
        $t_str = str_split($t_str);
        $l = intval($t_str[0]);
        array_shift($t_str);

        while(count($t_str) > $l) {
            array_pop($t_str);
        }

        $t_str = join('', $t_str);
        $calc_dec = base_convert($t_str, 32, 10);
        $md5_str = md5($calc_dec);

        // 根据提取出来的md5串和加密的md5串进行比较。确保加密串不能通过构造生成的
        if (strpos($md5_str, $md5_6) === 0)
            return $calc_dec;

        return false;
    }
}
?>
