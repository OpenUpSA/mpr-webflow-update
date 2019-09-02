
var timer, delay = 500;
var search_url = function(term) { return 'https://mpr.code4sa.org/api/v2/search-lite?q=' + term; }
var related_url = function(id) { return 'https://mpr.code4sa.org/api/v2/related?nappi=' + id };
var product_detail_url = function(id) { return 'https://mpr.code4sa.org/api/v3/detail?nappi=' + id };


var entermedicine = function(e) {
    searchTerm = e.target.value;
    if (searchTerm.length < 4) return;
    var load_data = function() {
        location.hash = 'search:' + searchTerm;
    }
    var reset_delay_before_requesting = function() {
        clearTimeout(timer);
        timer = setTimeout(load_data, delay);
    }
    reset_delay_before_requesting();
};
var load_medicines = function(value) {
    if (value.indexOf(':') >= 0) {
        var s = value.split(':')
        var key = s[0]
        var value = s[1]
        if (key == '#related') {
            load_data(related_url(value), process_request);
            log_analytics("product-related", {"id" : value});
        } else if (key == '#search') {
            load_data(search_url(value), process_request);
        }
    }
}
var process_request = function(result) {
  $('.listing').hide();
  $(".search-results").css("display", "block")
  if (result.length > 0) {
  	for (var i = 0; i < result.length; i++) {
    	var datum = result[i];
      var res = $(".listing")[i]
      res = $(res)
      if (res != undefined) {
        $('.cc-listing-name', res).text(datum.name);
        $('.listing-price', res).text(datum.sep);  
        $('.show-more', res).data('data-nappi', datum.nappi_code);     
        res.show();
        $('.show-more', res).click(createClickCallBack(res))
       }
    }
  }
}

function createClickCallBack(res) {
  return function() {
    var id = $(this).data('data-nappi');
    load_data(product_detail_url(id), function(resultObject) {
      return process_request_for_details(resultObject, res)
    });
  }
}

var process_request_for_details = function(resultObject, listing) {
  if (resultObject) {
    var res = $('.listing-accordion-content', listing);
    res = $(res)
    if (res != undefined) {
      $('.single-exit-price', res).text(resultObject.sep);
    }
  }
}

var load_data = function(url, foo) {
    return $.getJSON(url, function(data) {
        foo(data);
    });
}
