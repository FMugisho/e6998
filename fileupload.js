const bucketName = "photo-image-bucket-2";
const apiKey = "H9AHKTjE2W2XG3H1eZ8kO9L9II7O3KKU19iwwiKf";
const apiEndPoint = "https://4bai8kyq56.execute-api.us-east-1.amazonaws.com/v1"

window.onload = function() {
  // var image_upload = document.getElementById('image_upload');
  var sendbtn = document.getElementById('submit');
  var sendqbtn = document.getElementById('submitq');
  var image_display = document.getElementById('image_display');
  sendbtn.onclick = function() {
      var input = $("#fileupload").val();
      console.log(input)
      console.log('uploading file.....')


      // fileInput is an HTMLInputElement: <input type="file" id="myfileinput" multiple>
      var fileInput = document.getElementById("fileupload");

      // files is a FileList object (similar to NodeList)
      var file = fileInput.files[0];
      console.log(file)
      // "X-Api-Key": "LEX4Wft4ZNaCF3yFeEb1caGD1Ha9o6ZxcrlqY8gf" // old api key
      let config = {
          headers: {
              'Content-Type': 'multipart/form-data; boundary=${data._boundary}',
              "X-Api-Key": apiKey
          }
      }; //添加请求头

      // url = 'https://by8eqzalsj.execute-api.us-east-1.amazonaws.com/test/upload/' + file.name // old
      // url = 'https://by8eqzalsj.execute-api.us-east-1.amazonaws.com/test/upload/' + bucketName + file.name
      
      url = apiEndPoint + "/upload/" + bucketName + "/" + file.name

      axios.put(url, file, config).then(response => { //这里的/xapi/upimage为接口
          console.log(response.data)

      })
  }


  sendqbtn.onclick = function() {
      var input = $("#q").val();
      // TODO FMugisho - clean up the search bar here
      console.log(input)
      console.log('processing your input')

      var apigClient = apigClientFactory.newClient({
          apiKey: apiKey
      });
      var params = {
          //This is where any header, path, or querystring request params go. The key is the parameter named as defined in the API
          "q": input
      };
      var body = {
          //This is where you define the body of the request
      };
      var additionalParams = {
          //If there are any unmodeled query parameters or headers that need to be sent with the request you can add them here
          headers: {
              // param0: '',
              // param1: ''
          },
          queryParams: {

          }
      };

      apigClient.searchGet(params, body, additionalParams)
          .then(function(result) {
              //This is where you would put a success callback
              image_display.innerHTML = '';
              if (typeof(result.data.body) == 'undefined') {
                  console.log(result)
                  image_display.innerHTML += 'Could not find image matching your query';
              } else {
                  console.log(result)
                  //  console.log(typeof result.data.body)
                  var string_img_list = result.data.body;
                  var object_img_list = string_img_list.substring(1, string_img_list.length - 1);
                  var array = object_img_list.split(",");
                  // console.log(array)
                  // console.log(typeof array)
                  var src_host = "https://s3.amazonaws.com/photoalbumcc/";
                  if (array[0].length == 0) {
                      image_display.innerHTML += 'Sorry, there is no matching image!';
                  } else {
                      image_display.innerHTML += 'Success! Here is the query result(s): <br>';
                      for (var i = 0; i < array.length; i++) {
                          // console.log(array.length)
                          var img_name = ""
                          for (var j = 0; j < array[i].length; j++) {

                              if (array[i][j] != " " && array[i][j] != '"') {
                                  img_name += array[i][j];
                              }
                          }
                          src = src_host + img_name;

                          image_display.innerHTML += '<img src=' + src + '> <br>';
                      }
                  }
              }

              console.log('success')
          }).catch(function(result) {
              //This is where you would put an error callback
          });


  }

}

/* runSpeechRecognition function */
function runSpeechRecognition() {
  var transcript;
  // get output div reference
  var output = document.getElementById("output");
  // get action element reference
  var action = document.getElementById("action");
  // new speech recognition object
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var recognition = new SpeechRecognition();

  // This runs when the speech recognition service starts
  recognition.onstart = function() {
      // action.innerHTML = "<small>listening, please speak...</small>";
  };

  recognition.onspeechend = function() {
      // action.innerHTML = "<small>stopped listening, hope you are done...</small>";
      recognition.stop();
  }

  // This runs when the speech recognition service returns result
  recognition.onresult = function(event) {
      var q = document.getElementById("q"); // addition
      transcript = event.results[0][0].transcript;
      var confidence = event.results[0][0].confidence;
      // output.innerHTML = "<b>Text:</b> " + transcript + "<br/> <b>Confidence:</b> " + confidence * 100 + "%";
      q.value = transcript;
      output.classList.remove("hide");
  };

  // start recognition
  recognition.start();
  return transcript
}
