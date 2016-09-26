<?php

/**
 * Установить HTTP код результата
 * @param string $code Строка кода (напр., '404 Not Found')
 */
function set_http_code( $code )
{
    $sapi_name = php_sapi_name();

    if ( $sapi_name == 'cgi' || $sapi_name == 'cgi-fcgi' )
    {
        header( 'Status: ' . $code );
    }
    else
    {
        header( $_SERVER['SERVER_PROTOCOL'] . ' ' . $code );
    }
}

/**
 * Получить дату в формате SQL из частей год, месяц, день
 * @param string $year
 * @param string $month
 * @param string $day
 * @return string
 */
function sql_date_from_parts( $year, $month, $day )
{
    return str_pad( intval( $year ), 4, '0', STR_PAD_LEFT ) . '-'
        . str_pad( intval( $month ), 2, '0', STR_PAD_LEFT ) . '-'
        . str_pad( intval( $day ), 2, '0', STR_PAD_LEFT );
}
