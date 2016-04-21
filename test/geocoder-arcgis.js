
var should          = require('should'),
    GeocoderArcGIS  = require('../lib/geocoder-arcgis'),
    CLIENT_ID       = process.env.CLIENT_ID || null,
    CLIENT_SECRET   = process.env.CLIENT_SECRET || null;

describe('GeocoderArcGIS API Wrapper', function(){
  var geocoder;

  describe('Initializating', function() {

    it('without any arguments', function() {
      (function() {
        geocoder = new GeocoderArcGIS();
      }).should.not.throw();
    });

    it('with additional arguments', function() {
      geocoder = new GeocoderArcGIS({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      });

    });

  });


  describe('API responses without OAuth', function() {

    beforeEach(function(done){
      geocoder = new GeocoderArcGIS();
      done();
    });


    it('should be able to geocode', function(done) {
      geocoder.geocode('Berlin').then(function(res) {
        res.should.be.json;
        done();
      });
    });

    it('should be able to reverse geocode', function(done) {
      geocoder.reverse('51.484463,-0.195405').then(function(res) {
        res.should.be.json;
        done();
      });
    });

    it('should be able to suggest', function(done) {
      geocoder.suggest('Gauer Straße, Berlin').then(function(res) {
        res.should.be.json;
        done();
      });
    });

  });


  describe('API responses with OAuth (cached)', function() {

    before(function(done){
      geocoder = new GeocoderArcGIS({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      });
      done();
    });


    it('should be able to geocode with OAuth', function(done) {
      geocoder.geocode('Berlin',{
        forStorage: true
      }).then(function(res) {
        res.should.be.json;
        done();
      });
    });

    it('should be able to reverse geocode', function(done) {
      geocoder.reverse('51.484463,-0.195405',{
        forStorage: true
      }).then(function(res) {
        res.should.be.json;
        done();
      });
    });

    it('should be able to batch geocode', function(done) {

      geocoder.geocodeAddresses([
        {
          "SingleLine": "380 New York St., Redlands, CA, 92373"
        },
        {
          "Address": "1 World Way",
          "Neighborhood": "",
          "City": "Los Angeles",
          "Subregion": "",
          "Region": "CA"
        }
      ],{
      }).then(function(res) {
        res.should.be.json;
        done();
      });
    });


  });


  describe('Validations',function(){



  });

});
