
var should          = require('should'),
    GeocoderArcGIS  = require('../dist/lib/geocoder-arcgis'),
    CLIENT_ID       = process.env.CLIENT_ID || null,
    CLIENT_SECRET   = process.env.CLIENT_SECRET || null,
    TIMEOUT         = process.env.TEST_TIMEOUT || 5000;

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
      this.timeout(TIMEOUT);
      geocoder.geocode('Glogauer Straße 5, 10999, Berlin')
        .then(function(res) {
          res.should.be.json;
          done();
        })
        .catch(function(error) {
          console.log(error);
        });
    });

    it('should be able to reverse geocode', function(done) {
      this.timeout(TIMEOUT);
      geocoder.reverse('13.4375137,52.49452050000001')
        .then(function(res) {
          res.should.be.json;
          done();
        })
        .catch(function(error){
          console.log(error);
        });
    });

    it('should be able to suggest', function(done) {
      this.timeout(TIMEOUT);
      geocoder.suggest('Glogauer Straße, Berlin')
        .then(function(res) {
          res.should.be.json;
          done();
        })
        .catch(function(error) {
          console.log(error);
        });
    });

    it('should be able to findAddressCandidates', function(done) {
      this.timeout(TIMEOUT);
      geocoder.findAddressCandidates('380 New York Street, Redlands, CA 92373')
        .then(function(res) {
          res.should.be.json;
          done();
        })
        .catch(function(e){
          console.log(e);
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
      this.timeout(TIMEOUT);
      geocoder.geocode('Berlin',{
        forStorage: true
      }).then(function(res) {
        res.should.be.json;
        done();
      });
    });

    it('should be able to reverse geocode', function(done) {
      this.timeout(TIMEOUT);
      geocoder.reverse('13.4375137,52.49452050000001',{
        forStorage: true
      }).then(function(res) {
        res.should.be.json;
        done();
      })
      .catch(function(e){
        console.log(e);
      });
    });

    it('should be able to geocodeAddresses', function(done) {
      this.timeout(TIMEOUT);
      geocoder.geocodeAddresses([
        '381 New York St., Redlands, CA, 92373',
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
