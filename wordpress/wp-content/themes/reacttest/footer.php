<?php
    // Det vore best-practice att fetcha detta från frontend men varje request till WP är ganska seg så det bidrar bara till längre laddtider.
    $frontend_user = generate_frontend_user();
    if($frontend_user != null){
        $serialized = json_encode($frontend_user);
        echo "<input id='wp_user' type='hidden' value='" . $serialized . "'></input>";
    }

    wp_footer();
?>

<footer>

</footer>
</body>
</html>