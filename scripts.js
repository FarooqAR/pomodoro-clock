$(document).ready(function() {
    var defaultSessionLen = 25, //in minutes
        defaultBreakLen = 5, //in minutes
        currentTime = defaultSessionLen * 60, //current time as on the clock
        currentClock = "session",
        timeElapsed = 0; //seconds passed after each timer run
    $(".type").text(currentClock);
    $("#arc2").attr("d", describeArc(150, 150, 130, 0, 359.99)); //add a half-transparent placeholder cicle 
    $(".controls-break").on("click", function() {
        if (pomodoro == null) { //change break length only if the clock is not running
            var val = $(this).val();
            if (val === "minus" && defaultBreakLen > 1) {
                defaultBreakLen--;
            } else if (val === "plus") {
                defaultBreakLen++;
            }
            currentTime = defaultBreakLen * 60; //reset time
            timeElapsed = 0;
            $("#break_len").text(defaultBreakLen);
        }
    });
    $(".controls-session").on("click", function() {
        if (pomodoro == null) { //change session length only if the clock is not running
            var val = $(this).val();
            if (val === "minus" && defaultSessionLen > 1) {
                defaultSessionLen--;
            } else if (val === "plus") {
                defaultSessionLen++;
            }
            currentTime = defaultSessionLen * 60; //reset time
            timeElapsed = 0;
            $("#session_len").text(defaultSessionLen);
        }
    });

    var pomodoro = window.setInterval(timing, 1000); //window.setInterval will add it to global scope making it easier to remove later
    $(".clock").click(function() {
        $(this).addClass('animated'); //add animation when clock is clicked
        setTimeout(function() {
            $(".clock").removeClass("animated");
        }, 1000)
        if (pomodoro) { //if the clock is running
            window.clearInterval(pomodoro);
            pomodoro = null;
        } else { //otherwise
            pomodoro = window.setInterval(timing, 1000);
        }
    });




    function timing() {
        var timeElapsedPercentage = (currentClock === "session") ? timeElapsed / (defaultSessionLen * 60) : timeElapsed / (defaultBreakLen * 60);
        if (timeElapsedPercentage == 1) { //if it is 1 then the angle will be 360 and the arc doesn't show on 360 angle so evaluate it to nearest number
            timeElapsedPercentage = 0.9999;
        }
        $("#arc1").attr("stroke", (currentClock === "session") ? "#4CAF50" : "#F44336"); //change clock stroke color based on its type
        $(".time").text(getFormattedTime(currentTime)); //update time on screen
        $("#arc1").attr("d", describeArc(150, 150, 130, 0, timeElapsedPercentage * 360)); //update arc's path
        if (currentTime === 0) { //change clock when currentTime reaches to 0
            currentTime = (currentClock === "session") ? defaultBreakLen * 60 : defaultSessionLen * 60;
            currentClock = (currentClock === "session") ? "break" : "session";
            $(".type").text(currentClock); //update clock type on screen
            timeElapsed = 0;
        } else {
            currentTime--;
            timeElapsed++;
        }
    }

//returns: time in min:sec format
//args: time in milliseconds
    function getFormattedTime(time) { 
        var minutes = Math.floor(time / 60);
        var seconds = time % 60;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        return minutes + ":" + seconds;
    }

//helper methods to create path string, provided by a solution in stackoverflow
    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function describeArc(x, y, radius, startAngle, endAngle) {

        var start = polarToCartesian(x, y, radius, endAngle);
        var end = polarToCartesian(x, y, radius, startAngle);

        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

        var d = [
            "M", start.x, start.y,
            "A", radius, radius, 0, arcSweep, 0, end.x, end.y
        ].join(" ");

        return d;
    }


});