
    require("dotenv").config();

    var barAddress = "{{fsVenueData.location.address}}";
    console.log(barAddress);
    
    function validateBarAddress() {
        event.preventDefault();
          
          var barAddressArray = barAddress.split("");
      
          for (let i = 0; i < barAddressArray.length; i++) {
      
            if (barAddressArray[i] === " ") {
              barAddressArray.splice(i, 1, "%20");
              barAddress = barAddressArray.join("");
              console.log(barAddress);
    
              var embedMap = "https://www.google.com/maps/embed/v1/directions?origin=";
              var currentLocation = "3401%20grays%20ferry%20ave" + "&destination=";
              var key = "&key=" + "AIzaSyBUl9Z7Ak1vui_beP6_dTINgbnB9aNl5b4";
    
              var src = embedMap + currentLocation + barAddress + key;
    
              $(".map").attr("src", src);
    
            }
          };
    };
    
    validateBarAddress(event); 