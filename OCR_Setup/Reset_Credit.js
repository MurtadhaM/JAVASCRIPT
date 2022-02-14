




    var subscription_id='16A0CASxNNJvdH17P';


    var Token_Variable='_3ntsTdJOciu43j7FQoDGikK4eWEBK4wkG-HDSVEpArG1b_88FTzYWXBRjzH4s0Aer0m5a7nlEUGPnoELveKlg'; 
// end of post_request
var headers= {
    'Origin': 'https://accounts.mathpix.com',
'Content-Type': 'application/json',
'Accept': 'application/json',
'Cookie': `mathpix_token=Bearer ' + Token_Variable + '`
 
}
     
    // make a json  web post request
    function post_request(url, data, callback) {
        res = fetch(url, {
            method: 'POST',
            'Origin': 'https://accounts.mathpix.com',
            follow: 1,
            headers: {
                'Origin': 'https://accounts.mathpix.com',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cookie': `mathpix_token=Bearer ' + Token_Variable + '`
            },
            method: 'POST' , 

            body: (data)
        
        })
        
  
            .then(function (response) {
                return response;
                     
            })
            .then(function (data) {
                callback(data);
            })
            .catch(function (error) {
                console.log(error);
            });
// end of reset_credit
    }
    // end of post_request
    // make a json  web post request

 
var json_file =('{"plan_id":"free-plan","subscription_id":"16A0CASxNNJvdH17P"   , "excess_payments":10}')

    var url='https://api.mathpix.com/api/generate_checkout_existing_url';
    post_request(url, json_file, function (response) {
        console.log(response);
    }   );
        



