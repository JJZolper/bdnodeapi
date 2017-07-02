var mocha = require('mocha');
var chai = require('chai');
var request = require('request');

describe("Better Doctor Node API", function() {

  describe("Get Doctor information", function() {

    var url = "http://localhost:5000/api/v1/doctors/search?name=mike%20nichols";

    it("returns the doctor data with a 200", function() {
      request(url, function(error, response, body) {
        expect(body).to.equal("{\"practices\":[{\"location_slug\":\"ca-saratoga\",\"lat\":37.25636,\"lon\":-122.03586,\"uid\":\"d657bbd15625494682c0c29d797a3e52\",\"name\":\"Mike Nichols MD\",\"accepts_new_patients\":true,\"insurance_uids\":[],\"visit_address\":{\"city\":\"Saratoga\",\"lat\":37.25636,\"lon\":-122.03586,\"state\":\"CA\",\"state_long\":\"California\",\"street\":\"14583 Big Basin Way\",\"street2\":\"Ste 2B\",\"zip\":\"95070\"},\"office_hours\":[],\"phones\":[{\"number\":\"8883626713\",\"type\":\"fax\"},{\"number\":\"4086472130\",\"type\":\"landline\"}],\"languages\":[{\"name\":\"English\",\"code\":\"en\"}]}],\"educations\":[],\"profile\":{\"first_name\":\"Mike\",\"last_name\":\"Nichols\",\"slug\":\"mike-nichols-md\",\"title\":\"MD\",\"image_url\":\"https:\/\/asset1.betterdoctor.com\/assets\/general_doctor_male.png\",\"gender\":\"male\",\"languages\":[{\"name\":\"English\",\"code\":\"en\"}],\"bio\":\"Dr. Mike Nichols, MD treats patients in Saratoga, California and specializes in general practice.\\n\\nDr. Nichols is licensed to treat patients in California.\\n\\nDr. Nichols has been found during an automated background check to be clear of any malpractice history and holds one or more active medical licenses.\"},\"ratings\":[],\"insurances\":[],\"specialties\":[{\"uid\":\"general-practitioner\",\"name\":\"General Practice\",\"description\":\"Specializes and treats your total health.\",\"category\":\"medical\",\"actor\":\"General Practitioner\",\"actors\":\"General Practitioners\"}],\"licenses\":[{\"number\":\"G49792\",\"state\":\"CA\"}],\"uid\":\"ebfca2b339d1e5e23ce0af3ab1c886f4\",\"npi\":\"1285896373\"}");
        expect(response.statusCode).to.equal(200);
      });
    });

  });

});


