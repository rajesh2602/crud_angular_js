<?php

require_once 'db_connect.php';
$type = isset($_POST['type']) ? $_POST['type'] : '';
switch ($type) {
    case "insertUserData":
        $checkUser = checkEmailPhone($_POST['data']);
        if (empty($checkUser)) {
            $insertUser = insertUsers($_POST['data']);
            if ($insertUser) {
                echo json_encode(array('status' => '1', 'message' => 'Successfully Inserted'));
                exit;
            } else {
                echo json_encode(array('status' => '0', 'message' => 'Somethink went wrong please try again later.'));
                exit;
            }
        } else {
            echo json_encode(array('status' => '0', 'message' => 'Email Id or Phone Number Already Exit.'));
            exit;
        }
        break;

    case "getUserData":
        $getUserList = getUserList();
        echo json_encode(array('status' => '1', 'message' => 'User List', 'result' => $getUserList));
        break;

    case "getUserDataById":
        $getUserList = getUserDataById($_POST['user_id']);
        echo json_encode(array('status' => '1', 'message' => 'User Data', 'result' => $getUserList));
        break;

    case "deleteUser":
        $getUserList = deleteUser($_POST['data']);
        echo json_encode(array('status' => '1', 'message' => 'User Deleted Successfully'));
        break;

    case "editUserData":
        $checkUser = checkEmailPhone($_POST['data'], $_POST['user_id']);
        if (empty($checkUser)) {
            updateUsers($_POST['data'], $_POST['user_id']);
            echo json_encode(array('status' => '1', 'message' => 'Successfully Updated'));
            exit;
        } else {
            echo json_encode(array('status' => '0', 'message' => 'Email Id or Phone Number Already Exit.'));
            exit;
        }
        break;
    default:
        break;
}
?>