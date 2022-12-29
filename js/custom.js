$(window).on("load", function () {
 
  var range = $("#range").attr("value");
  $("#demo").html(range);
  $(".slide").css("width", "50%");
  $(document).on("input change", "#range", function (e) {
    // console.log($(this).val());
    $("#demo").html($(this).val());
    var slideWidth
if($(e.target).attr("data-val")=="dec"){
slideWidth = (($(this).val()-48) * 100) /e.target.max;
} 
else{
slideWidth = ($(this).val() * 100) /e.target.max;

} 
// console.log(slideWidth);

    $(".slide").css("width", slideWidth + "%");
  });
});
  const getGeo = async()=>{
   let data = await fetch("https://api.ipgeolocation.io/ipgeo?apiKey=aeb2eb4dc83343719d98af4cda062356")
   let resp =await data.json()
   console.log("resp",resp.state_prov)
   $('.city').html(resp.state_prov);

   return resp.state_prov
  }
  const con = getGeo()

  console.log("con",con)

//   const center = { lat: 50.064192, lng: -130.605469 };
// // Create a bounding box with sides ~10km away from the center point
// const defaultBounds = {
//   north: center.lat + 0.1,
//   south: center.lat - 0.1,
//   east: center.lng + 0.1,
//   west: center.lng - 0.1,
// };
// const input = document.getElementById("pac-input");
// const options = {
//   bounds: defaultBounds,
//   componentRestrictions: { country: "us" },
//   fields: ["address_components", "geometry", "icon", "name"],
//   strictBounds: false,
//   types: ["establishment"],
// };
// const autocomplete = new google.maps.places.Autocomplete(input, options);
// console.log(autocomplete)
  // ------------step-wizard-------------
  // $(document).ready(function() {
  //     $('.nav-tabs > li a[title]').tooltip();
  
  //     //Wizard
  //     $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
  
  //         var target = $(e.target);
  
  //         if (target.parent().hasClass('disabled')) {
  //             return false;
  //         }
  //     });
  
  //     $(".next-step").click(function(e) {
  
  //         var active = $('.wizard .nav-tabs li.active');
  //         active.next().removeClass('disabled');
  //         nextTab(active);
  
  //     });
  //     $(".prev-step").click(function(e) {
  
  //         var active = $('.wizard .nav-tabs li.active');
  //         prevTab(active);
  
  //     });
  // });
  
  // function nextTab(elem) {
  //     $(elem).next().find('a[data-toggle="tab"]').click();
  // }
  
  // function prevTab(elem) {
  //     $(elem).prev().find('a[data-toggle="tab"]').click();
  // }
  
  // $('.nav-tabs').on('click', 'li', function() {
  //     $('.nav-tabs li.active').removeClass('active');
  //     $(this).addClass('active');
  // });
  
  $(".solar-cost-data .btn-main").click(function () {
    $(".solar-cost-data .btn-main.active").removeClass("active"); // Just remove class from all folder
    $(this).addClass("active"); // add onto current
  });

//   function initialize() {
//     var input = document.getElementById('pac-input');
//     var autocomplete = new google.maps.places.Autocomplete(input);
// }
  // ------------register-steps--------------
  $(document).ready(function ($) {
    // google.maps.event.addDomListener(window, 'load', initialize);
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


    //asdsad
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
      // console.log('called');
    //   console.log(e);
      let checkBtnTrigger = e.currentTarget.hasAttribute('data-zip-btn')
      if(checkBtnTrigger){
        let Btn = document.querySelector('[data-zip-btn]');
        //Show Loader
        Btn.querySelector('.text').style.display = 'none';
        Btn.querySelector('.spinner-border').style.display = 'inline-block'
        
        let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));

        console.log(getLocalStorage.zipCode);
  
        const URL = "https://api.powersolarsavings.com/api/v1/power-solar/utility";
        // const URL = "http://localhost:7000/api/v1/power-solar/utility";
      
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({zip: getLocalStorage.zipCode}),
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
                <a href="javascript:void(0);" class="btn-main next-tep w-100">${utility.utility_name}</a>
              </div>
          </div>`
        })

        utilities += `<div class="col-sm-6 col-12">
        <div class="form-group">
           <a href="javascript:void(0);" class="btn-main next-tep w-100">Other</a>
        </div>
     </div>`

        // console.log(document.querySelector('p[data-zip-error] + .wizard__main .row'));

        document.querySelector('p[data-zip-error] + .wizard__main .row').innerHTML = utilities;

        // console.log(utilities);



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


        // console.log(data);
        // alert('yes')
      }else{
        var $active = $(".wizard .nav-tabs li a.active");
        $active.parent().next().children().removeClass("disabled");
        $active.parent().addClass("done");
        nextTab($active);
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
      if($(".firstNameInp").val() == ''){
        $(".firstNameInp_errormsg").show();
        return false;
      }
      if($(".lastNameInp").val() == ''){
        $(".lastNameInp_errormsg").show();
        return false;
      }
    }
    if($("#step7").hasClass('active')){
      if($("#phone").val() == '' || $("#phone").val().length < 13 || $("#phone").val().length > 14){
        $(".phoneNumber_errormsg").show();
        return false;
      }else{
        window.location.href = 'quote-report.html'
      }
    }
    $(elem).parent().next().find('a[data-toggle="tab"]').click();
  }
  function prevTab(elem) {
    
    $(elem).parent().prev().find('a[data-toggle="tab"]').click();
  }
  $("#zipCode, #phoneNumber")
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
        // dropdown.addClass("open").addClass("in");
  
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
    homeSqFoot: "",
    zipCode: "",
    avgBill: "",
    utilityProvider: "",
    address: "",
    roofSunlight: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  };
  
  let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
  
  if (!getLocalStorage) {
    localStorage.setItem("power-solar-data", JSON.stringify(data));
  }

  //========= validations ==========
  if(document.querySelector('#zipCodeForm')){
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
      // alert('yes')
    })
  }

  if(document.querySelector('#pac-input')){
    document.querySelector('#pac-input').addEventListener('input', (e) => {
      let element = e.currentTarget;
      if(element.classList.contains('error')){
        element.classList.remove('error')
      }
    })
  }

  if(document.querySelector('#pac-input-form')){
    document.querySelector('#pac-input-form').addEventListener('submit', (e) => {
      e.preventDefault();

      let form = e.currentTarget;
      let formData = new FormData(form);

      if(formData.get('home_address') == ''){
        form.querySelector('input').classList.add('error');
        return ;
      }

      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      getLocalStorage["address"] = formData.get('home_address');
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));

      console.log(getLocalStorage);

      form.querySelector('a.next-step').click();

      console.log(e.currentTarget);
    })
  }

  function handleInput(e){
    let elment = e.currentTarget.closest('div')
    // console.log(elment.querySelector('span.error-msg'));
    elment.querySelector('span.error-msg').style.display = 'none'
    // elment.style.display = 'none';
  }

  // console.log(document.querySelector('#pac-input-form'));

  function isNumberKey(evt){
      var charCode = (evt.which) ? evt.which : evt.keyCode
      if (charCode > 31 && (charCode < 48 || charCode > 57))
          return false;
      return true;
  }

  function isValidEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }

  //============= validations =================
  
  if (document.querySelector(".homeSqFootRange")) {
    document.querySelector(".homeSqFootRange").addEventListener("input", (e) => {
      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      getLocalStorage["homeSqFoot"] = e.currentTarget.value;
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
    });
  }
  
  if (document.getElementById("zipCode")) {
    document.getElementById("zipCode").addEventListener("keyup", (e) => {
      let form = e.currentTarget.closest('form');
      form.querySelector('span').innerText = ''
      // console.log(JSON.parse(localStorage.getItem("power-solar-data")));
      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      getLocalStorage["zipCode"] = e.currentTarget.value;
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
    });
  }
  
  if (document.querySelector(".avgBillRange")) {
    document.querySelector(".avgBillRange").addEventListener("input", (e) => {
      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      getLocalStorage["avgBill"] = e.currentTarget.value;
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
    });
  }
  
  if (document.querySelector(".utilityProvider")) {
    document.querySelectorAll(".utilityProvider").forEach((ele) => {
      ele.addEventListener("click", (e) => {
        let selectedOption = e.currentTarget.innerText;
        let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
        getLocalStorage["utilityProvider"] = selectedOption;
        localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
      });
    });
  }
  
  if (document.querySelector(".roofSunlight")) {
    document.querySelectorAll(".roofSunlight").forEach((ele) => {
      ele.addEventListener("click", (e) => {
        let selectedOption = e.currentTarget.querySelector("h3").innerText;
        let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
        getLocalStorage["roofSunlight"] = selectedOption;
        localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
      });
    });
  }
  
  if (document.querySelector(".emailInp")) {
    document.querySelector(".emailInp").addEventListener("keyup", (e) => {
      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      getLocalStorage["email"] = e.currentTarget.value;
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
    });
  }
  
  if (document.querySelector(".firstNameInp")) {
    document.querySelector(".firstNameInp").addEventListener("keyup", (e) => {
      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      getLocalStorage["firstName"] = e.currentTarget.value;
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
    });
  }
  
  if (document.querySelector(".lastNameInp")) {
    document.querySelector(".lastNameInp").addEventListener("keyup", (e) => {
      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      getLocalStorage["lastName"] = e.currentTarget.value;
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
    });
  }
  
  if (document.getElementById("phone")) {
    document.getElementById("phone").addEventListener("keyup", (e) => {
      let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
      getLocalStorage["phone"] = e.currentTarget.value;
      localStorage.setItem("power-solar-data", JSON.stringify(getLocalStorage));
    });
  }
  
  const onSubmitData = async () => {
    let getLocalStorage = JSON.parse(localStorage.getItem("power-solar-data"));
  
    const URL = "https://api.usdirectautoinsurance.com/api/v1/power-solar/create";
  
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

  if(document.querySelector('#speciallink')){
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
      // console.log(obj);
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
  
