(function ($) {
  
var WEEKDAYS_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],


$.widget("custom.temperatur", {
  options: {
    temp: 18,
    min: 0,
    max: 50,
    timestamp: new Date(),
    weekdays: 'en',
    scalewidth: 6,
    tempUnit: 'Celsius',
    timeActive: 'yes'
  },

  getTime: function(cb) {
    var self = this;
      $.ajax({
        type: 'GET',
        url: 'http://www.timeapi.org/utc/now.json?callback=?',
        async: false,
        jsonpCallback: 'jsonCallback',
        contentType: "application/json",
        dataType: 'jsonp',
        success: function (json) {
          cb(json.dateString);
          // console.log('success', json);
        },
        error: function(e) {
          console.log('An AJAX error occured: ', e.message);
        }
      });

    },




  _create: function() {
    var self = this;

    self.preprocessData();
  },
  
  
  dom : {
    $weekdays: $('<div class="weekdays"/>'),
  }

  
  
  preprocessData: function() {
    var self = this,
        $clock = $('<div id="clock" class="light" />'),
        $weekdays,
        $clock;

    self.mtime = Date.parse(self.options.timestamp);


    $clock.html('<div class="display">
      <div class="weekdays"></div>
      <div id="buttonicons"><i class="fa fa-hourglass extra"></i></div><div class="digits digitsTime"/><div class="digits digitsC"/><div class="digits digitsF"/><div id="tempumschalt"><div id="tempunits"></div><div class="tacho"><i class="fa fa-tachometer"></i></div></div></div></div>');
    self.element.append($divelem);



    self.$clock = $('#clock');

    self.digit_to_name = 'zero one two three four five six seven eight nine minus'.split(' ');


    self.digitsC = {};
    self.digitsF = {};
    self.digitsTime = {};



    self.digit_holderC = self.$clock.find('.digitsC');
    self.digit_holderF = self.$clock.find('.digitsF');
    self.digit_holderTime = self.$clock.find('.digitsTime');




    self.
      self.weekday_names_de = 'SON MON DIE MIT DON FRE SAM'.split(' '),
      self.weekday_names_en_short = 'S M TU W TH F ST'.split(' '),
      self.weekday_names_de_short = 'S M DI MI DO F SA'.split(' '),
      self.weekday_holder = self.$clock.find('.weekdays');

    self.temp_units = '°C °F h'.split(' ');
    self.newTemp;

    self.calculate_temp();

    self.ExecuteFunc();
  },


  _builddisplay: function() {

    var self = this,
      positions = ;

    ['i1', 'i2', 'i3', '.', 'd1', 'd2'].forEach(function(position) {

      if (position == '.') {
        self.digit_holderC.append('<div class="dots"/>');
        self.digit_holderF.append('<div class="dots"/>');
        self.digit_holderTime.append('<div class="doubledots"/>');


      } else {

        var posC = $('<div>');
        var posF = $('<div>');
        var posTime = $('<div>');

        for (var i = 1; i < 8; i++) {
          posC.append('<span class="d' + i + '">');
          posF.append('<span class="d' + i + '">');
          posTime.append('<span class="d' + i + '">');

        }

        // Set the digits as key:value pairs in the digits object
        self.digitsC[position] = posC;
        self.digitsF[position] = posF;
        self.digitsTime[position] = posTime;

        // Add the digit elements to the page
        self.digit_holderC.append(posC);
        self.digit_holderF.append(posF);
        self.digit_holderTime.append(posTime);
      }

    });

  },


  ExecuteFunc: function() {
    var self = this;
    self._builddisplay();
    self.update_weekdays();
    self.ClickTimeTempToggle();
    self.ClickTempToggle();

    if (self.options.timeActive === 'no' && self.options.tempUnit == 'Celsius') {
      $('.extra').removeClass('fa-sun-o');
      $('.extra').addClass('fa-hourglass');
      $('.digitsC').css("display", 'block');
      $('.digitsF').css("display", 'none');
      $('.digitsTime').css("display", 'none');

    } else if (self.options.timeActive == 'no' && self.options.tempUnit == 'Fahrenheit') {
      $('.extra').removeClass('fa-sun-o');
      $('.extra').addClass('fa-hourglass');
      $('.digitsC').css("display", 'none');
      $('.digitsF').css("display", 'block');
      $('.digitsTime').css("display", 'none');


    } else if (self.options.timeActive == 'yes') {
      $('.extra').removeClass('fa-hourglass');
      $('.extra').addClass('fa-sun-o');
      $('.digitsC').css("display", 'none');
      $('.digitsF').css("display", 'none');
      $('.digitsTime').css("display", 'block');
      document.getElementById("tempunits").innerHTML = self.temp_units[2];
      $('#tempumschalt .fa-tachometer').removeClass('fa-tachometer');
    }

    self.update_temp();
  },


  ClickTempToggle: function() {
    var buttonWrapper,
      self = this;

    buttonWrapper = $('i.fa-tachometer');

    buttonWrapper.on('click', function(evt) {
      if (event.type == 'click') {
        if ($('.digitsC').css("display") == 'block') {
          $('.digitsC').css("display", 'none');
          $('.digitsF').css("display", 'block');
          document.getElementById("tempunits").innerHTML = self.temp_units[1];
          self.options.tempUnit = 'Fahrenheit';
        } else if ($('.digitsF').css("display") == 'block') {
          $('.digitsC').css("display", 'block');
          $('.digitsF').css("display", 'none');
          document.getElementById("tempunits").innerHTML = self.temp_units[0];
          self.options.tempUnit = 'Celsius';
        }

        console.log(self.options);
      } else if (event.type == 'mouseover') {
        $(this).addClass('iconStyle');
      } else {
        $(this).removeClass('iconStyle');
      }

    });

  },


  ClickTimeTempToggle: function() {
    var buttonWrapper,
      self = this;

    buttonWrapper = $('i.fa-hourglass');

    buttonWrapper.on('click mouseover mouseout', function(evt) {
      if (event.type == 'click') {
        if (self.options.timeActive == 'no') {
          $('.digitsC').addClass('hidden');
          $('.digitsF').css("display", 'none');
          $('.digitsTime').removeClass('hidden')

          document.getElementById("tempunits").innerHTML = self.temp_units[2];
          self.options.timeActive = 'yes';
          $('#tempumschalt .fa-tachometer').removeClass('fa-tachometer');
          $('.extra').removeClass('fa-hourglass');
          $('.extra').addClass('fa-sun-o');
        } else {
          $('.digitsC').css("display", 'block');
          $('.digitsF').css("display", 'none');
          $('.digitsTime').css("display", 'none');
          document.getElementById("tempunits").innerHTML = self.temp_units[0];
          self.options.timeActive = 'no';
          self.options.tempUnit = 'Celsius';
          $('#tempumschalt .fa').addClass('fa-tachometer');
          $('.extra').removeClass('fa-sun-o').addClass('fa-hourglass');
        }

        console.log(self.options);
      } else if (event.type == 'mouseover') {
        $(this).addClass('iconStyle');
      } else {
        $(this).removeClass('iconStyle');
      }

    });

  },


  update_temp: function() {
    var self = this;
    var zeit;

    self.getTimeObject.getTimeFromServer(function(dates) {
      zeit = dates;
      console.log('handleData', zeit);
      self.today = new Date(dates);

      var strC = parseFloat(self.options.temp).toFixed(2),
        strCString = strC.toString(),
        strF = parseFloat(self.newTemp).toFixed(2),
        strFString = strF.toString(),
        hourString = self.today.getHours().toString(),
        minuteString = self.today.getMinutes().toString(),
        nullString = ' ',
        zeroString = '0';

      // console.log(self.today.getMinutes().toString());
      // console.log(self.today.getMinutes().toString().length);
      // console.log(self.options.temp);
      // console.log(strCString);
      // console.log(strFString);

      if (strCString.length == 5) {
        strCString = nullString.concat(strCString);
        console.log(strCString);
      }


      if (strFString.length == 5) {
        strFString = nullString.concat(strFString);
        console.log(strFString);
      }

      if (strFString.length == 7) {
        strFString = strFString.substr(1, strFString.length);
        console.log(strFString);
      }


      if (strCString.length == 4) {
        strCString = nullString.concat(nullString.concat(strCString));
        console.log(strCString);
      }


      if (strFString.length == 4) {
        strFString = nullString.concat(nullString.concat(strFString));
        console.log(strFString);
      }


      if (strCString.length == 3) {
        strCString = zeroString.concat(nullString.concat(nullString.concat(strCString)));
        console.log(strCString);
      }


      if (strFString.length == 3) {
        strFString = zeroString.concat(nullString.concat(nullString.concat(strFString)));
        console.log(strFString);
      }


      //------------------------------------------------

      if (hourString.length == 1) {
        hourString = '  ' + hourString; // '  5'
      } else if (hourString.length == 0) {
        hourString = nullString.concat(nullString.concat(zeroString));
      } else if (hourString.length == 2) {
        hourString = nullString.concat(hourString);
      }



      if (minuteString.length == 0) {
        minuteString = zeroString.concat(zeroString.concat(minuteString));
        //console.log(minuteString);
      }

      if (minuteString.length == 1) {
        minuteString = zeroString.concat(minuteString);
        //console.log(minuteString);
      }



      strTimeString = hourString + ':' + minuteString;


      var tempNumberTableC = strCString.split(""),
        tempNumberTableF = strFString.split(""),
        TimeNumberTable = strTimeString.split("");

      //console.log(TimeNumberTable);


      if (self.options.temp < 0) {
        self.digitsC.i1.attr('class', self.digit_to_name[10]);
      } else {
        self.digitsC.i1.attr('class', self.digit_to_name[tempNumberTableC[0]]);
      }
      self.digitsC.i2.attr('class', self.digit_to_name[tempNumberTableC[1]]);
      self.digitsC.i3.attr('class', self.digit_to_name[tempNumberTableC[2]]);
      self.digitsC.d1.attr('class', self.digit_to_name[tempNumberTableC[4]]);
      self.digitsC.d2.attr('class', self.digit_to_name[tempNumberTableC[5]]);



      if (self.newTemp < 0) {
        self.digitsF.i1.attr('class', self.digit_to_name[10]);
      } else {
        self.digitsF.i1.attr('class', self.digit_to_name[tempNumberTableF[0]]);
      }
      self.digitsF.i2.attr('class', self.digit_to_name[tempNumberTableF[1]]);
      self.digitsF.i3.attr('class', self.digit_to_name[tempNumberTableF[2]]);
      self.digitsF.d1.attr('class', self.digit_to_name[tempNumberTableF[4]]);
      self.digitsF.d2.attr('class', self.digit_to_name[tempNumberTableF[5]]);


      self.digitsTime.i1.attr('class', self.digit_to_name[TimeNumberTable[0]]);
      self.digitsTime.i2.attr('class', self.digit_to_name[TimeNumberTable[1]]);
      self.digitsTime.i3.attr('class', self.digit_to_name[TimeNumberTable[2]]);
      self.digitsTime.d1.attr('class', self.digit_to_name[TimeNumberTable[4]]);
      self.digitsTime.d2.attr('class', self.digit_to_name[TimeNumberTable[5]]);

      if (self.options.timeActive == 'no') {

        if (self.options.tempUnit === 'Celsius') {

          document.getElementById("tempunits").innerHTML = self.temp_units[0];
        } else if (self.options.tempUnit === 'Fahrenheit') {
          document.getElementById("tempunits").innerHTML = self.temp_units[1];
        }

      } else if (self.options.timeActive == 'yes') {
        document.getElementById("tempunits").innerHTML = self.temp_units[2];
      }

    });
    setTimeout(self.update_temp.bind(self), 60000);

  },




  calculate_temp: function() {
    var self = this;

    if (self.options.tempUnit == 'Celsius') {
      self.newTemp = 9 / 5 * self.options.temp + 32;
      console.log(self.newTemp);
    } else if (self.options.tempUnit == 'Fahrenheit') {
      self.newTemp = (self.options.temp - 32) * 5 / 9;
      console.log(self.newTemp);
    }
  },



  update_weekdays: function() {
    var self = this,
      currentDay = new Date(self.options.timestamp).getDay();
    //------------------- Konditional -------------------------------         
    if (self.options.scalewidth < 6) {

      if (self.options.weekdays === 'de') {
        $.each(self.weekday_names_de_short, function() {
          self.weekday_holder.append('<span>' + this + '</span>');
        });
      } else {
        $.each(self.weekday_names_en_short, function() {
          self.weekday_holder.append('<span>' + this + '</span>');
        });
      }

    } else {

      if (self.options.weekdays === 'de') {
        $.each(self.weekday_names_de, function() {
          self.weekday_holder.append('<span>' + this + '</span>');
        });
      } else {
        $.each(self.weekday_names_en, function() {
          self.weekday_holder.append('<span>' + this + '</span>');
        });
      }

    }
    //----------------------------------------------------------------
    self.weekdays = self.$clock.find('.weekdays span');

    self.weekdays.removeClass('active').eq(currentDay).addClass('active');

  }

});

}(jQuery));