(function( $ ) {
    function isSelected(el) {
        return $(el).hasClass('ss-sel');
    }

    function findStrip(el) {
        return $(el).parents('.selstrip');
    }

    function isValueEl(el) {
        return $(el).parent().hasClass('selstrip');
    }

    function refreshTracking(el) {
        var ss = findStrip(el);
        var data = $(ss).data('selStrip');

        if (!isValueEl(el) || !data.sel_anchor) {
            return;
        }

        var ia = $(ss).children().index(data.sel_anchor);
        var ca = $(ss).children().index(el);
        if (ca < ia) {
            var it = ia;
            ia = ca;
            ca = it;
        }

        $(ss).children().removeClass('ss-sel-track').removeClass('ss-desel-track');

        if (ca < $(ss).children().length) {
            $(ss).children().slice(ia, ca+1).addClass(data.deselect ? 'ss-desel-track' : 'ss-sel-track');
        } else {
            $(ss).children().slice(ia).addClass(data.deselect ? 'ss-desel-track' : 'ss-sel-track');
        }
    }

    function stopTracking(ss, confirmed) {
        if (confirmed) {
            $('.ss-desel-track', ss).removeClass('ss-sel');
            $('.ss-sel-track', ss).addClass('ss-sel');
        }

        $(ss).children().removeClass('ss-sel-track').removeClass('ss-desel-track');

        $(ss).trigger('change');
    }

    function mousedown(event) {
        if ($(this).hasClass('ss-readonly')) {
          return;
        }
        
        var data = $(this).data('selStrip');

        data.sel_anchor = event.target;
        data.deselect = isSelected(event.target);

        $(event.target).addClass(data.deselect ? 'ss-desel-track' : 'ss-sel-track');
    }

    function mousemove(event) {
        var data = $(this).data('selStrip');

        if (data.sel_anchor) {
            refreshTracking(event.target);
        }
    }

    function mouseup(event) {
        var data = $(this).data('selStrip');

        stopTracking(this, isValueEl(event.target));

        delete data.sel_anchor;

    }

    function mouseover(event) {
        refreshTracking(event.target);
    }

    function mouseout(event) {
        var data = $(this).data('selStrip');

        if ($(event.target).parent()[0] !== this) {
            stopTracking(this);

            delete data.sel_anchor;
        }
    }

    function init(ss, options) {
        $.each(options.values, function() {
            ss.append('<div>' + this + '</div>');
        });

        ss.mousedown(mousedown);
        ss.mousemove(mousemove);
        ss.mouseup(mouseup);

        ss.mouseover(mouseover);
        ss.mouseout(mouseout);

        $.each(options.selected, function() {
			ss.find("div:contains(" + this + ")").addClass("ss-sel");
        });
    }

    $.fn.selStrip = function(options) {
        if (typeof options === 'object') {
            options = $.extend({}, $.fn.selStrip.defaults, options);

            init(this, options);

            this.data('selStrip', options);
        } else {
            switch (options) {
                case 'values': {
                    var vl = [];
                    $('.ss-sel', this).each(function () {
                        vl.push($(this).text());
                    });

                    return vl;
                } break;

                case 'readonly': {
                  if (arguments.length > 1) {
                    if (arguments[1]) {
                      $(this).addClass('ss-readonly');
                    } else {
                      $(this).removeClass('ss-readonly');
                    }
                  }
                } break;
            }
        }

        return this;
    };

    $.fn.selStrip.defaults = {
        values:[],
        selected:[],
        readonly: false
    };
}( jQuery ));
