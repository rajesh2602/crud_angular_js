<?php

// Connecting to database as mysqli_connect("hostname", "username", "password", "database name");
$con = mysqli_connect("localhost", "root", "", "rajesh");

function p($data, $exit = 0) {
    echo "<pre>";
    print_r($data);
    if ($exit == 0) {
        exit;
    }
}

function checkEmailPhone($data, $id = '') {
    global $con;
    $where = "";
    if (is_numeric($id) && $id > 0) {
        $where .= " AND u_id <> '" . $id . "'";
    }
    $sql = "SELECT * FROM user WHERE (u_email ='" . $data['u_email'] . "' OR u_phone ='" . $data['u_phone'] . "') " . $where;
    $qry = mysqli_query($con, $sql);
    $res = mysqli_fetch_assoc($qry);
    return $res;
}

function insertUsers($data) {
    global $con;
    $date = date('Y-m-d H:i:s');
    $sql = "INSERT INTO `user`(`u_fname`, `u_lname`, `u_email`, `u_phone`, `u_address`, `u_created`) "
            . "VALUES ('" . $data['u_fname'] . "','" . $data['u_lname'] . "','" . $data['u_email'] . "','" . $data['u_phone'] . "','" . $data['u_address'] . "','" . $date . "')";
    $qry = mysqli_query($con, $sql);
    $last_id = mysqli_insert_id($con);
    return $last_id;
}

function getUserList() {
    global $con;
    $sql = "SELECT * FROM user";
    $qry = mysqli_query($con, $sql);
    $result = array();
    while ($res = mysqli_fetch_assoc($qry)) {
        $result[] = $res;
    }
    return $result;
}

function deleteUser($user_id) {
    global $con;
    $sql = "DELETE FROM user WHERE u_id = '" . $user_id . "'";
    mysqli_query($con, $sql);
}

function updateUsers($data, $id) {
    global $con;
    $sql = "UPDATE user SET u_fname='" . $data['u_fname'] . "', u_lname='" . $data['u_lname'] . "', u_email='" . $data['u_email'] . "', u_phone='" . $data['u_phone'] . "', u_address='" . $data['u_address'] . "' WHERE u_id = '" . $id . "'";
    mysqli_query($con, $sql);
}

?>