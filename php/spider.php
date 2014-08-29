<?php
class Spider {
    protected $dir = './tmp/';
    protected $url;
    protected $urls = array();
    static $max_deep_times = 1;
    static $exclude_type = array('js', 'css');
    public $level;

    public function __construct($url, $level = 1) {
        $this->url = $url;
        $this->level = $level;
        $this->init($url);
    }

    protected function init($url) {
        $type = $this->get_url_type($url);
        $type = $type ? $type : '';
        $content = $this->get_content($url);

        if ($content) {
            if ($type == 'png' || $type == 'jpeg' || $type == 'gif' || $type == 'jpg') {
                $name = $this->get_file_name($url);
                $this->save_content($name, $content);
            } else if (!in_array($type, self::$exclude_type)) {
                // 广度遍历一层
                $this->urls = $this->collect_urls($content);
                $this->combine_url($url);
                var_dump($this->urls);
                $this->filter_url();
                var_dump($this->urls);
                if ($this->level < self::$max_deep_times) {
                    foreach($this->urls as $url) {
                        new Spider($url, $this->level + 1);
                    }
                }
            }
        }
    }

    protected function combine_url($url) {
        $host = pathinfo($url);
        foreach ($this->urls as $key => $value) {
            if (substr($value, 0, 1) === '.')
                $value = substr($value, 1);
            if (!(strpos($value, "http://") !== false))
                $this->urls[$key] = $host['dirname'] . $value;
        }
    }

    protected function get_file_name($url) {
        $pathArr = parse_url($url);
        // 过滤掉空值
        $pathSplit = array_filter(explode('/', $pathArr['path']));

        return array_pop($pathSplit);
    }

    protected function filter_url() {
        $urls = array();
        foreach ($this->urls as $key => $url) {
            if (strpos($url, "javascript:") !== false || strpos($url, " ") !== false) {
            } else {
                //preg_match_all("/^http(?:s)?:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*(?:[^<>\"\"])*$/", $url, $matchs);
                //if ($matchs[0][0])
                // 根据当前url，筛选相关度大于0.5的链接
                if (UrlSimilary::get_destence($this->url, $url) >= 0.5)
                    array_push($urls, $url);
            }
        }
        $this->urls = $urls;
    }

    protected function collect_urls($content) {
        // 收集超链接中的链接
        $urls = array();
        preg_match_all("/href=\"([^\"]+)\"/", $content, $matchs);
        $urls = array_merge($urls, $matchs[1]);

        // FIX 超链接
        preg_match_all("/href='([^']+)'/", $content, $matchs);
        $urls = array_merge($urls, $matchs[1]);

        // 收集img标签
        preg_match_all("/\bsrc=\"([^\"]+)\"/", $content, $matchs);
        $urls = array_merge($urls, $matchs[1]);

        // 去掉空链接
        $urls = array_filter($urls);

        return $urls;
    }

    protected function get_content($url) {
        $content = file_get_contents($url);
        var_dump($content);
        if (strpos($http_response_header[0], '200')) {
            return $content;
        }
        return false;
    }

    protected function save_content($name, $content) {
        $fd = fopen($this->dir . $name, 'w');
        fwrite($fd, $content);
        fclose($fd);
    }

    protected function get_url_type($url) {
        if (strlen($url)) {
            $pathArr = parse_url($url);
            // 过滤掉空值
            $pathSplit = array_filter(explode('/', $pathArr['path']));
            $type = array_pop($pathSplit);
            if ($type) {
                //preg_match_all("/\w+(?:\.(png|gif|jpeg|bmp|jpg|html|xhtml|php|jsp))$/i", $type, $matchs);
                preg_match_all("/\w+(?:\.(\w+))$/i", $type, $matchs);
                $matchs = array_filter($matchs);

                return $matchs[1][0];
            }
        }
        return false;
    }
}

// NICE
chdir(dirname(__FILE__));
include "./urlSimilary.php";

$url = "http://www.baidu.com";
$curl = new Spider($url);
