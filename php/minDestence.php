<?php
$str1 = 'http://www.baidu.com/s?wd=dsf&pn=10&oq=dsf&ie=utf-8&usm=3&cus_f=11';
$str2 = 'http://www.baidu.com/s?wd=dsf&pn=0&oq=dsf&ie=utf-8&usm=3&cus_f=11';

function get_destence($str1, $str2) {
    $len1 = strlen($str1);
    $len2 = strlen($str2);
    $tmp = array();

    if ($len1 == 0 || $len2 == 0)
        return max($len1, $len2);

    for ($i = 0, $len = $len1; $i <= $len; $i++) {
        $tmp[$i] = array();
        for ($j = 0, $jLen = $len2; $j <= $jLen; $j++) {
            if ($i == 0)
                $tmp[$i][$j] = $j;
            else if ($i && $j == 0)
                $tmp[$i][$j] = $i;
            else
                $tmp[$i][$j] = 0;
        }
    }

    $label = 0;
    for ($i = 0, $len = $len1; $i < $len; $i++) {
        for ($j = 0, $jLen = $len2; $j < $jLen; $j++) {
            if ($str1[$i] == $str2[$j])
                $label = 0;
            else
                $label = 1;

            $tmp[$i + 1][$j + 1] = min($tmp[$i][$j + 1] + 1, $tmp[$i + 1][$j] + 1, $tmp[$i][$j] + $label);
        }
    }
    return (1 - $tmp[$len1][$len2] / max($len1, $len2));
}
echo get_destence($str1, $str2);
