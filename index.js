$w.onReady(function () {
    $w("#startButton").onClick(() => {
        wixLocation.to("/detect");
    });
});
