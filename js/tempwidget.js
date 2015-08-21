/*jslint unparam: true */
/*global jQuery*/

(function ($) {
    "use strict";

/*-------------------------------------------------------------------------------------------------------
  Globale variables for displaying weekday shortcuts and temperature units for Celsius and Fahrenheit
 -------------------------------------------------------------------------------------------------------*/

    var WEEKDAYS_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
        WEEKDAYS_DE = ['SON', 'MON', 'DIE', 'MIT', 'DON', 'FRE', 'SAM'],
        WEEKDAYS_EN_SHORT = ['S', 'M', 'TU', 'W', 'TH', 'F', 'ST'],
        WEEKDAYS_DE_SHORT = ['S', 'M', 'DI', 'MI', 'DO', 'F', 'SA'],
        TEMP_UNITS = ['°C', '°F', 'h'];

/*-------------------------------------------------------------------------------------------------------
   Start Widget
--------------------------------------------------------------------------------------------------------*/

    $.widget("custom.temperatur", {
        options: {
            temp: 18,
            weekdays: 'en',
            scalewidth: 6,
            tempUnit: 'Celsius',
            timeActive: 'yes'
        },

/*------------------------------------------------------------------------------------------------------
   Request on time server to retrieve date string in jsonp format with callback handling
------------------------------------------------------------------------------------------------------*/

        getTimeFromServer: function (cb) {
            return $.ajax({
                type: 'GET',
                url: 'http://www.timeapi.org/utc/now.json?callback=?',
                async: true,
                jsonpCallback: 'jsonCallback',
                contentType: 'application/json',
                dataType: 'jsonp',
                success: function (json) {
                    cb(json.dateString);
                },
                error: function (e) {
                    console.log('An AJAX error occured: ', e.message);
                }
            });

        },

/*------------------------------------------------------------------------------------------------------
   JQuery-selectors for DOM elements to be used in widget
------------------------------------------------------------------------------------------------------*/

        dom: {
            $clock: $('<div id="clock" class="light"/>'),
            $display: $('<div class="display"/>'),
            $weekdays: $('<div class="weekdays"/>'),
            $buttonIcons: $('<div id="buttonicons">'),
            $hourglass: $('<i class="fa fa-hourglass extra"/>'),
            $digitsTime: $('<div class="digits digitsTime"/>'),
            $digitsCelsius: $('<div class="digits digitsC"/>'),
            $digitsFahrenheit: $('<div class="digits digitsF"/>'),
            $tempChangeButton: $('<div id="tempumschalt"/>'),
            $tempUnits: $('<div id="tempunits"/>'),
            $tachoDiv: $('<div class="tacho"/>'),
            $tachometer: $('<i class="fa fa-tachometer"/>')
        },
/*-----------------------------------------------------------------------------------------------------
   Adding DOM elements for building the widget plus function calls
-----------------------------------------------------------------------------------------------------*/

        _create: function () {
            var self = this,
                $fullButtonDiv = self.dom.$buttonIcons.append(self.dom.$hourglass),
                $fullTempChangeDiv = self.dom.$tempChangeButton.append(self.dom.$tempUnits, self.dom.$tachoDiv.append(self.dom.$tachometer)),
                $realDisplay = self.dom.$display.append(self.dom.$weekdays, $fullButtonDiv, self.dom.$digitsTime, self.dom.$digitsCelsius, self.dom.$digitsFahrenheit, $fullTempChangeDiv);

            $realDisplay = self.dom.$clock.append($realDisplay);

            self.element.append($realDisplay);

            self.digit_to_name = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'minus'];
            self.digitsC = {};
            self.digitsF = {};
            self.digitsTime = {};
            self.calculate_temp();
            self.ExecuteFunc();
        },


        _builddisplay: function () {

            var self = this,
                positions = ['i1', 'i2', 'i3', '.', 'd1', 'd2'];

            $.each(positions, function (index, value) {

                if (value === '.') {
                    self.dom.$digitsCelsius.append('<div class="dots"/>');
                    self.dom.$digitsFahrenheit.append('<div class="dots"/>');
                    self.dom.$digitsTime.append('<div class="doubledots"/>');


                } else {

                    var posC = $('<div>'),
                        posF = $('<div>'),
                        posTime = $('<div>'),
                        i;

                    for (i = 1; i < 8; i++) {
                        posC.append('<span class="d' + i + '">');
                        posF.append('<span class="d' + i + '">');
                        posTime.append('<span class="d' + i + '">');

                    }
                    // Set the digits as key:value pairs in the digits object
                    self.digitsC[value] = posC;
                    self.digitsF[value] = posF;
                    self.digitsTime[value] = posTime;
                    self.dom.$digitsCelsius.append(posC);
                    self.dom.$digitsFahrenheit.append(posF);
                    self.dom.$digitsTime.append(posTime);
                }

            });

        },

        checkOptionsInput: function () {
            var self = this;
            if (!(self.options.tempUnit === 'Celsius' || self.options.tempUnit === 'Fahrenheit')) {
                console.log("FOOL!! Don't you know how to type 'Celsius' or 'Fahrenheit'??");
            }

            if (!(self.options.timeActive === 'yes' || self.options.timeActive === 'no')) {
                console.log("FOOL!! Don't you know how to type 'yes' or 'no'??");
            }

            if (!(self.options.weekdays === 'en' || self.options.weekdays === 'de')) {
                console.log("FOOL!! Don't you know how to type 'en' or 'de'??");
            }
        },


        ExecuteFunc: function () {
            var self = this;

            self.checkOptionsInput();
            self._builddisplay();
            self.update_weekdays();
            self.ClickTimeTempToggle();
            self.ClickTempToggle();

            if (self.options.timeActive === 'no' && self.options.tempUnit === 'Celsius') {
                self.dom.$hourglass.removeClass('fa-sun-o');
                self.dom.$hourglass.addClass('fa-hourglass');
                self.dom.$digitsCelsius.css("display", 'block');
                self.dom.$digitsFahrenheit.css("display", 'none');
                self.dom.$digitsTime.css("display", 'none');

            } else if (self.options.timeActive === 'no' && self.options.tempUnit === 'Fahrenheit') {
                self.dom.$hourglass.removeClass('fa-sun-o');
                self.dom.$hourglass.addClass('fa-hourglass');
                self.dom.$digitsCelsius.css("display", 'none');
                self.dom.$digitsFahrenheit.css("display", 'block');
                self.dom.$digitsTime.css("display", 'none');


            } else if (self.options.timeActive === 'yes') {
                self.dom.$hourglass.removeClass('fa-hourglass');
                self.dom.$hourglass.addClass('fa-sun-o');
                self.dom.$digitsCelsius.css("display", 'none');
                self.dom.$digitsFahrenheit.css("display", 'none');
                self.dom.$digitsTime.css("display", 'block');
                self.dom.$tempUnits.text(TEMP_UNITS[2]);
                $('#tempumschalt .fa-tachometer').removeClass('fa-tachometer');
            }

            self.update_time_from_server();
            self.update_temp();
        },


        ClickTempToggle: function () {
            var buttonWrapper,
                self = this;

            buttonWrapper = $('i.fa-tachometer');

            buttonWrapper.on('click', function (evt) {
                if (evt.type === 'click') {
                    if (self.dom.$digitsCelsius.css("display") === 'block') {
                        self.dom.$digitsCelsius.css("display", 'none');
                        self.dom.$digitsFahrenheit.css("display", 'block');
                        self.dom.$tempUnits.text(TEMP_UNITS[1]);
                        self.options.tempUnit = 'Fahrenheit';
                    } else if (self.dom.$digitsFahrenheit.css("display") === 'block') {
                        self.dom.$digitsCelsius.css("display", 'block');
                        self.dom.$digitsFahrenheit.css("display", 'none');
                        self.dom.$tempUnits.text(TEMP_UNITS[0]);
                        self.options.tempUnit = 'Celsius';
                    }

                    console.log(self.options);
                }
            });
        },


        ClickTimeTempToggle: function () {
            var buttonWrapper,
                self = this;

            buttonWrapper = $('i.fa-hourglass');

            buttonWrapper.on('click', function (evt) {
                if (evt.type === 'click') {
                    if (self.options.timeActive === 'no') {
                        self.dom.$digitsCelsius.css("display", 'none');
                        self.dom.$digitsFahrenheit.css("display", 'none');
                        self.dom.$digitsTime.css("display", 'block');

                        self.dom.$tempUnits.text(TEMP_UNITS[2]);
                        self.options.timeActive = 'yes';
                        $('#tempumschalt .fa-tachometer').removeClass('fa-tachometer');
                        self.dom.$hourglass.removeClass('fa-hourglass');
                        self.dom.$hourglass.addClass('fa-sun-o');
                    } else {
                        self.dom.$digitsCelsius.css("display", 'block');
                        self.dom.$digitsFahrenheit.css("display", 'none');
                        self.dom.$digitsTime.css("display", 'none');
                        self.dom.$tempUnits.text(TEMP_UNITS[0]);
                        self.options.timeActive = 'no';
                        self.options.tempUnit = 'Celsius';
                        $('#tempumschalt .fa').addClass('fa-tachometer');
                        self.dom.$hourglass.removeClass('fa-sun-o');
                        self.dom.$hourglass.addClass('fa-hourglass');
                    }

                    console.log(self.options);
                }
            });
        },

        update_temp: function () {
            var self = this,
                strC = parseFloat(self.options.temp).toFixed(2),
                strCString = strC.toString(),
                strF = parseFloat(self.newTemp).toFixed(2),
                strFString = strF.toString(),
                nullString = ' ',
                zeroString = '0';

            function handleTempStringLength(tempString, digitObject, temp) {
                var tempNumberTable;

                switch (tempString.length) {
                case 5:
                    tempString = nullString.concat(tempString);
                    console.log(tempString);
                    break;
                case 4:
                    tempString = nullString.concat(nullString.concat(tempString));
                    console.log(tempString);
                    break;
                case 3:
                    tempString = zeroString.concat(nullString.concat(nullString.concat(tempString)));
                    console.log(tempString);
                    break;
                }

                tempNumberTable = tempString;

                if (temp < 0) {
                    digitObject.i1.attr('class', self.digit_to_name[10]);
                } else {
                    digitObject.i1.attr('class', self.digit_to_name[tempNumberTable[0]]);
                }

                digitObject.i2.attr('class', self.digit_to_name[tempNumberTable[1]]);
                digitObject.i3.attr('class', self.digit_to_name[tempNumberTable[2]]);
                digitObject.d1.attr('class', self.digit_to_name[tempNumberTable[4]]);
                digitObject.d2.attr('class', self.digit_to_name[tempNumberTable[5]]);
            }

            handleTempStringLength(strCString, self.digitsC, self.options.temp);
            handleTempStringLength(strFString, self.digitsF, self.newtemp);

            if (self.options.timeActive === 'no') {

                if (self.options.tempUnit === 'Celsius') {
                    $("#tempunits").text(TEMP_UNITS[0]);
                } else if (self.options.tempUnit === 'Fahrenheit') {
                    $("#tempunits").text(TEMP_UNITS[1]);
                }

            } else if (self.options.timeActive === 'yes') {
                $("#tempunits").text(TEMP_UNITS[2]);
            }
        },

        digitizeTime: function (time) {
            var self = this,
                today = new Date(time),
                hourString = today.getHours().toString(),
                minuteString = today.getMinutes().toString(),
                nullString = ' ',
                zeroString = '0',
                strTimeString;

            if (hourString.length === 1) {
                hourString = nullString.concat(nullString.concat(hourString));
            } else if (hourString.length === 0) {
                hourString = nullString.concat(nullString.concat(zeroString));
            } else if (hourString.length === 2) {
                hourString = nullString.concat(hourString);
            }

            if (minuteString.length === 0) {
                minuteString = zeroString.concat(zeroString.concat(minuteString));
            }

            if (minuteString.length === 1) {
                minuteString = zeroString.concat(minuteString);
            }

            strTimeString = hourString + ':' + minuteString;

            var TimeNumberTable = strTimeString;


            self.digitsTime.i1.attr('class', self.digit_to_name[TimeNumberTable[0]]);
            self.digitsTime.i2.attr('class', self.digit_to_name[TimeNumberTable[1]]);
            self.digitsTime.i3.attr('class', self.digit_to_name[TimeNumberTable[2]]);
            self.digitsTime.d1.attr('class', self.digit_to_name[TimeNumberTable[4]]);
            self.digitsTime.d2.attr('class', self.digit_to_name[TimeNumberTable[5]]);
        },

        update_time_from_server: function () {
            var self = this,
                timems;

            self.getTimeFromServer(function (dates) {
                timems = Date.parse(dates);
                console.log('handleData', timems);

                setInterval(function () {
                    timems += 1000;
                    return timems;
                }, 1000);

                setInterval(function () {
                    return self.digitizeTime(timems);
                }, 1000);

            });

            //setTimeout(self.update_time_from_server.bind(self), 300000);

        },



        calculate_temp: function () {
            var self = this;

            if (self.options.tempUnit === 'Celsius') {
                self.newTemp = 9 / 5 * self.options.temp + 32;
                console.log(self.newTemp);
            } else if (self.options.tempUnit === 'Fahrenheit') {
                self.newTemp = (self.options.temp - 32) * 5 / 9;
                console.log(self.newTemp);
            }
        },



        update_weekdays: function () {
            var self = this,
                currentDay = new Date().getDay();
            //------------------- Konditional -------------------------------
            if (self.options.scalewidth < 6) {

                if (self.options.weekdays === 'de') {
                    $.each(WEEKDAYS_DE_SHORT, function () {
                        self.dom.$weekdays.append('<span>' + this + '</span>');
                    });
                } else {
                    $.each(WEEKDAYS_EN_SHORT, function () {
                        self.dom.$weekdays.append('<span>' + this + '</span>');
                    });
                }

            } else {

                if (self.options.weekdays === 'de') {
                    $.each(WEEKDAYS_DE, function () {
                        self.dom.$weekdays.append('<span>' + this + '</span>');
                    });
                } else {
                    $.each(WEEKDAYS_EN, function () {
                        self.dom.$weekdays.append('<span>' + this + '</span>');
                    });
                }

            }
            //----------------------------------------------------------------
            self.weekdays = self.dom.$clock.find('.weekdays span');

            self.weekdays.removeClass('active').eq(currentDay).addClass('active');

        }

    });


}(jQuery));