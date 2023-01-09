// localStorage.clear();
$(window).on("load", function () {

  var range = $("#range").attr("value");
  $("#demo").html(range);
  $(".slide").css("width", "50%");
  $(document).on("input change", "#range", function (e) {
    $("#demo").html($(this).val());
    var slideWidth;
    if ($(e.target).attr("data-val")=="dec") {
      slideWidth = (($(this).val()-48) * 100) /e.target.max;
    } else {
      slideWidth = ($(this).val() * 100) /e.target.max;
    }
    $(".slide").css("width", slideWidth + "%");
  });

});

const getGeo = async() => {
  $.ajax({
    url: "https://geolocation-db.com/jsonp",
    jsonpCallback: "callback",
    dataType: "jsonp",
    success: function(location) {
      $('.city').html(location.city);
      return location.city;
    }
  });
}

const con = getGeo();

$(".solar-cost-data .btn-main").click(function () {
  $(".solar-cost-data .btn-main.active").removeClass("active"); // Just remove class from all folder
  $(this).addClass("active"); // add onto current
});

  // ------------register-steps--------------
  $(document).ready(function ($) {
    $("#phone")
    .mask("(999)999-9999")
    .on("change", function() {
    
        var last = $(this).val().substr( $(this).val().indexOf("-") + 1 );
    
        if( last.length == 3 ) {
            var move = $(this).val().substr( $(this).val().indexOf("-") - 1, 1 );
            var lastfour = move + last;
            var first = $(this).val().substr( 0, 9 ); // Change 9 to 8 if you prefer mask without space: (99)9999?9-9999
    
            $(this).val( first + '-' + lastfour );
        }
    })
    .change();

    $(".nav-tabs > li a[title]").tooltip();
    //Wizard
    $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
      var $target = $(e.target);
      if ($target.hasClass("disabled")) {
        return false;
      }
  
      // handle with prgressbar
      var step = $(e.target).data("step");
      var percent = (parseFloat(step) / 7) * 100;
      percent = parseInt(percent);
      // percent = percent.toFixed(2)
      $(".wizard-persantage").html(percent + "%");
      $(".progress-bar").css({ width: percent + "%" });
      $(".progress-bar").text("Step " + step + " of 7");
      $(".wizard-persantage").blur(function () {
        var amt = parseFloat(this.value);
        $(this).val("$" + amt.toFixed(2));
      });
    });
  
    $('a[data-toggle="tab"]').on("show.bs.tab", function (e) {
      var $target = $(e.target);
      $target.parent().addClass("active");
    });
  
    $('a[data-toggle="tab"]').on("hide.bs.tab", function (e) {
      var $target = $(e.target);
      $target.parent().removeClass("active");
    });
  
    $(".picker .next-step").click(function () {
      $(this).parent().children().removeClass("active");
      $(this).addClass("active");
    });
  
    $(".next-step").click(async function (e) {
      let checkBtnTrigger = e.currentTarget.hasAttribute('data-zip-btn')
      if(checkBtnTrigger){
        let Btn = document.querySelector('[data-zip-btn]');
        //Show Loader
        Btn.querySelector('.text').style.display = 'none';
        Btn.querySelector('.spinner-border').style.display = 'inline-block'
        
        let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));

        console.log(getLocalStorage);
  
        const URL = "https://api.powersolarsavings.com/api/v1/power-solar/utility";
        // const URL = "http://localhost:7000/api/v1/power-solar/utility";
      
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({zip: getLocalStorage.zip_code}),
        };
      
        const response = await fetch(URL, options);
      
        const data = await response.json();

        if(!data || data.data.length <= 0){
          document.querySelector('[data-zip-error]').style.display = 'block'
          document.querySelector('[data-zip-error] + div').style.display = 'none'
          
          Btn.querySelector('.text').style.display = 'block';
          Btn.querySelector('.spinner-border').style.display = 'none'
        
          var $active = $(".wizard .nav-tabs li a.active");
          $active.parent().next().children().removeClass("disabled");
          $active.parent().addClass("done");
          nextTab($active);

          return;
        }

        let utilities = '';
        data.data.forEach(utility => {
          utilities += `<div class="col-sm-6 col-12">
              <div class="form-group">
                <a href="javascript:void(0);" class="btn-main next-tep w-100 utilityProvider">${utility.utility_name}</a>
              </div>
          </div>`
        })

        utilities += `<div class="col-sm-6 col-12">
        <div class="form-group">
           <a href="javascript:void(0);" class="btn-main next-tep w-100 utilityProvider">Other</a>
        </div>
     </div>`

        document.querySelector('p[data-zip-error] + .wizard__main .row').innerHTML = utilities;
        
        var $active = $(".wizard .nav-tabs li a.active");
        $active.parent().next().children().removeClass("disabled");
        $active.parent().addClass("done");
        nextTab($active);
        
        $(".next-tep").click(async function (e) {
          var $active = $(".wizard .nav-tabs li a.active");
          $active.parent().next().children().removeClass("disabled");
          $active.parent().addClass("done");
          nextTab($active);
        })
      }else{
        var $active = $(".wizard .nav-tabs li a.active");
        $active.parent().next().children().removeClass("disabled");
        $active.parent().addClass("done");
        nextTab($active);
      }
        
        if (document.querySelector(".utilityProvider")) {
          document.querySelectorAll(".utilityProvider").forEach((ele) => {
            ele.addEventListener("click", (e) => {
              let selectedOption = e.currentTarget.innerText;
              let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
              getLocalStorage["utility_provider"] = selectedOption;
              localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
            });
          });
        }
    });
  
    $(".prev-step").click(function (e) {
      var $active = $(".wizard .nav-tabs li a.active");
      prevTab($active);
    });
  });
  
  function nextTab(elem) {
    $(".error-msg").hide();
    if($("#step5").hasClass('active')){
      var email = isValidEmail($('.emailInp').val());
      if(email == false){
        $('.emailInp_vemail').show()
        return false;
      }
    }
    if($("#step6").hasClass('active')){
      if ($(".firstNameInp").val() == '') {
        $(".firstNameInp_errormsg").show();
        return false;
      }
      if ($(".lastNameInp").val() == '') {
        $(".lastNameInp_errormsg").show();
        return false;
      }
    }
    if ($("#step7").hasClass('active')) {
      if ($("#phone").val() == '' || $("#phone").val().length < 13 || $("#phone").val().length > 14) {
        $(".phoneNumber_errormsg").show();
        return false;
      } else {
        onSubmitData();
      }
    }
    $(elem).parent().next().find('a[data-toggle="tab"]').click();
  }

  function prevTab(elem) { 
    $(elem).parent().prev().find('a[data-toggle="tab"]').click();
  }

  $("#zip_code, #phoneNumber")
    .unbind("keyup change input paste")
    .bind("keyup change input paste", function (e) {
      var $this = $(this);
      var val = $this.val();
      var valLength = val.length;
      var maxCount = $this.attr("max");
      if (valLength > maxCount) {
        $this.val($this.val().substring(0, maxCount));
      }
    });
  
  //code = 2k minified
  function initAutocomplete() {
    const autocompleteHotels = new google.maps.places.Autocomplete(
       (document.getElementById('pac-input')),
       {
          types: ['geocode']
       }
    );

    google.maps.event.addListener(autocompleteHotels, 'place_changed', function () {
      var place = autocompleteHotels.getPlace();
      var latitude = place.geometry.location.lat();
      var longitude = place.geometry.location.lng();
      var latlng = new google.maps.LatLng(latitude, longitude);

      var geocoder = geocoder = new google.maps.Geocoder();
       
      geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            var address = results[0].formatted_address;
            var pin = results[0].address_components[results[0].address_components.length - 1].long_name;
            var country = results[0].address_components[results[0].address_components.length - 2].long_name;
            var state = results[0].address_components[results[0].address_components.length - 3].short_name;
            var city = results[0].address_components[results[0].address_components.length - 4].long_name;
            
            if (state == 'US') {
              var state = results[0].address_components[results[0].address_components.length - 4].short_name;
              var city = results[0].address_components[results[0].address_components.length - 5].long_name;
            }
            if (state == 'US') {
              var state = results[0].address_components[results[0].address_components.length - 5].short_name;
              var city = results[0].address_components[results[0].address_components.length - 6].long_name;
            }
            let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
            
            getLocalStorage["state"] = state;
            localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));

            getLocalStorage["city"] = city;
            localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
          }
        }
      });
    });
  }
  
  function createAuto(i, elem) {
    var input = $(elem);
    var dropdown = input.closest(".dropdown");
    var listContainer = dropdown.find(".list-autocomplete");
    var listItems = listContainer.find(".dropdown-item");
    var hasNoResults = dropdown.find(".hasNoResults");
  
    listItems.hide();
    listItems.each(function () {
      $(this).data("value", $(this).text());
      //!important, keep this copy of the text outside of keyup/input function
    });
  
    input.on("input", function (e) {
      if ((e.keyCode ? e.keyCode : e.which) == 13) {
        $(this).closest(".dropdown").removeClass("open").removeClass("in");
        return; //if enter key, close dropdown and stop
      }
      if ((e.keyCode ? e.keyCode : e.which) == 9) {
        return; //if tab key, stop
      }
  
      var query = input.val().toLowerCase();
  
      if (query.length > 1) {
  
        listItems.each(function () {
          var text = $(this).data("value");
          if (text.toLowerCase().indexOf(query) > -1) {
            var textStart = text.toLowerCase().indexOf(query);
            var textEnd = textStart + query.length;
            var htmlR =
              text.substring(0, textStart) +
              "<em>" +
              text.substring(textStart, textEnd) +
              "</em>" +
              text.substring(textEnd + length);
            $(this).html(htmlR);
            $(this).show();
          } else {
            $(this).hide();
          }
        });
  
        var count = listItems.filter(":visible").length;
        count > 0 ? hasNoResults.hide() : hasNoResults.show();
      } else {
        listItems.hide();
        dropdown.removeClass("open").removeClass("in");
        hasNoResults.show();
      }
    });
  
    listItems.on("click", function (e) {
      var txt = $(this)
        .text()
        .replace(/^\s+|\s+$/g, ""); //remove leading and trailing whitespace
      input.val(txt);
  
      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      getLocalStorage["address"] = txt.replace(/\s\s+/g, " ");
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
  
      dropdown.removeClass("open").removeClass("in");
    });
  }
  
  $(".jAuto").each(createAuto);
  
  $(document).on("focus", ".jAuto", function () {
    $(this).select(); // in case input text already exists
  });
  
  let data = {
    lp_campaign_id: "63b6f613a6bd3",
    lp_campaign_key: "y39HV4CJ6GFWwxq7vTmB",
    lp_s1: "",
    //lp_action: "test",
    first_name: "",
    last_name: "",
    phone_home: "",
    address: "",
    city: "",
    state: "NY",
    zip_code: "",
    email_address: "",
    ip_address: "",
    credit: "Excellent",
    roof_shade: "",
    homeowner: "Yes",
    landing_page_url: window.location.pathname,
    user_agent: navigator.userAgent,
    monthly_bill: "",
    tcpa_text: "full_phone_text_dnc_message",
    tcpa_optin: "",
    utility_provider: "",
    project_timeframe: "Immediate",
    //jornaya_lead_id: "4XYZ78B9-0CDC-43A7-98EA-2B680A5313A2",
  };
  
  let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
  
  if (!getLocalStorage) {
    localStorage.setItem("power-solar-data", JSON.stringify(data));
  }

  getIP();

  function getIP() {
    var range = $("#range").val();
    if (range) {
      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      var monthly_bill= range;
      if (monthly_bill < 100) {
        getLocalStorage["monthly_bill"] = "Less than $100";
      } else if (monthly_bill > 100 && monthly_bill < 200) {
        getLocalStorage["monthly_bill"] = "From $100 to $200";
      } else if (monthly_bill > 200 && monthly_bill < 300) {
        getLocalStorage["monthly_bill"] = "From $200 to $300";
      } else {
        getLocalStorage["monthly_bill"] = "More than $300";
      }      
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));

      getLocalStorage["electric_bill"] = range;
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
    }

    $.getJSON("https://api.ipify.org?format=json", function(data) {
      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      getLocalStorage["ip_address"] = data.ip;
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
      return data.ip;
    });
  }

  //========= Validations ==========
  if (document.querySelector('#zipCodeForm')) {
    document.querySelector('#zipCodeForm').addEventListener('submit', (e) => {
      e.preventDefault();
      let form = e.currentTarget;
      let formData = new FormData(form);

      if(formData.get('zip_code') == '' || formData.get('zip_code').length != 5){
        form.querySelector('span').innerText = 'Please Enter a Valid Zip Code';
        return ; 
      }else{
        form.querySelector('span').innerText = '';
      }

      window.location.href = 'solar-wizard.html';
    })
  }

  if(document.querySelector('#pac-input')) {
    document.querySelector('#pac-input').addEventListener('input', (e) => {
      let element = e.currentTarget;
      if(element.classList.contains('error')) {
        element.classList.remove('error')
      }
    })
  }

  if(document.querySelector('#pac-input-form')) {
    document.querySelector('#pac-input-form').addEventListener('submit', (e) => {
      e.preventDefault();

      let form = e.currentTarget;
      let formData = new FormData(form);

      if (formData.get('home_address') == '') {
        form.querySelector('input').classList.add('error');
        return ;
      }

      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      getLocalStorage["address"] = formData.get('home_address');
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
      
      form.querySelector('a.next-step').click();
    })
  }

  function handleInput(e) {
    let elment = e.currentTarget.closest('div')
    elment.querySelector('span.error-msg').style.display = 'none'
    // elment.style.display = 'none';
  }


  function isNumberKey(evt) {
      var charCode = (evt.which) ? evt.which : evt.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57))
          return false;
      return true;
  }

  function isValidEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }

  // ============= Validations =================
  if (document.querySelector(".homeSqFootRange")) {
    document.querySelector(".homeSqFootRange").addEventListener("input", (e) => {
      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      getLocalStorage["homeSqFoot"] = e.currentTarget.value;
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
    });
  }
  
  if (document.getElementById("zip_code")) {
    document.getElementById("zip_code").addEventListener("keyup", (e) => {
      let form = e.currentTarget.closest('form');
      form.querySelector('span').innerText = ''
      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      getLocalStorage["zip_code"] = e.currentTarget.value;
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
    });
  }
  
  if (document.querySelector(".avgBillRange")) {
    document.querySelector(".avgBillRange").addEventListener("input", (e) => {
      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      getLocalStorage["monthly_bill"] = e.currentTarget.value;
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
    });
  }
  
  if (document.querySelector(".utilityProvider")) {
    document.querySelectorAll(".utilityProvider").forEach((ele) => {
      ele.addEventListener("click", (e) => {
        let selectedOption = e.currentTarget.innerText;
        let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
        getLocalStorage["utility_provider"] = selectedOption;
        localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
      });
    });
  }

  if (document.querySelector(".roofSunlight")) {
    document.querySelectorAll(".roofSunlight").forEach((ele) => {
      ele.addEventListener("click", (e) => {
        let selectedOption = e.currentTarget.querySelector("h3").innerText;
        let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));

        var roof_shade= selectedOption;
        
        if (roof_shade == 'Full Sunlight') {
          getLocalStorage["roof_shade"] = "Not shaded";
        } else if (roof_shade == 'Some Shade' || roof_shade == 'Uncertain' || roof_shade == 'Severe Shade') {
          getLocalStorage["roof_shade"] = "Slightly shaded";
        }
        localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
      });
    });
  }
  
  if (document.querySelector(".emailInp")) {
    document.querySelector(".emailInp").addEventListener("keyup", (e) => {
      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      getLocalStorage["email_address"] = e.currentTarget.value;
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
    });
  }
  
  if (document.querySelector(".firstNameInp")) {
    document.querySelector(".firstNameInp").addEventListener("keyup", (e) => {
      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      getLocalStorage["first_name"] = e.currentTarget.value;
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
    });
  }
  
  if (document.querySelector(".lastNameInp")) {
    document.querySelector(".lastNameInp").addEventListener("keyup", (e) => {
      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      getLocalStorage["last_name"] = e.currentTarget.value;
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
    });
  }
  
  if (document.getElementById("phone")) {
    document.getElementById("phone").addEventListener("keyup", (e) => {
      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      getLocalStorage["phone_home"] = e.currentTarget.value;
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
    });
  }
  
  const onSubmitData = async () => {

    let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
    console.log('getLocalStorage---->',getLocalStorage);
    return false;

    //const URL = "https://api.usdirectautoinsurance.com/api/v1/power-solar/create";
    
    const URL = "https://leadgenmedia.leadspediatrack.com/post.do";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(getLocalStorage),
    };
  
    const response = await fetch(URL, options);
  
    const data = await response.json();
  
    if (data && data.status) {
      // localStorage.clear();
      window.location.href = "quote-report.html";
    }
  };
  
  if (document.getElementById("successBtn")) {
    document.getElementById("successBtn").addEventListener("click", onSubmitData);
  }

  if (document.querySelector('#speciallink')) {
    document.querySelector('#speciallink').addEventListener('click', (e) => {
      e.preventDefault();

      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      
      let obj = {
        firstname: getLocalStorage.firstName,
        lastname: getLocalStorage.lastName,
        email: getLocalStorage.email,
        phone: getLocalStorage.phone,
        address: getLocalStorage.address.replaceAll(' ', '+'),
        zipcode: getLocalStorage.zipCode
      }

      let queryString = ''
      for (key in obj){
        queryString += `${key}=${obj[key]}`
        if(key != 'zipcode'){
          queryString += '&'
        }
      }

      let a = document.createElement('a');
      a.setAttribute('href', `https://secure.rspcdn.com/xprr/red/PID/12032/SID/sid_here?${queryString}`)
      a.setAttribute('target', '_blank');

      a.click();
      console.log(queryString);
    })
  }
  
