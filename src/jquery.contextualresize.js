(function($) {
	var noScale, showAll, noBorder, exactFit, wall;
	var layout = {};

	layout.noScale = noScale = function(area, target, positionX, positionY) {
		if (positionX == null) {
			positionX = 0.5;
		}
		if (positionY == null) {
			positionY = 0.5;
		}
		return {
			x: area.x + (area.width - target.width) * positionX,
			y: area.y + (area.height - target.height) * positionY,
			width: target.width,
			height: target.height
		};
	};

	layout.showAll = showAll = function(area, target, positionX, positionY) {
		var areaRatio, r, targetRatio;

		if (positionX == null) {
			positionX = 0.5;
		}
		if (positionY == null) {
			positionY = 0.5;
		}
		r = {
			x: target.x,
			y: target.y
		};
		if (target.width > 0 && target.height > 0) {
			areaRatio = area.width / area.height;
			targetRatio = target.width / target.height;

			if (areaRatio > targetRatio) {
				r.width = target.width * (area.height / target.height);
				r.height = area.height;
			} else if (areaRatio < targetRatio) {
				r.width = area.width;
				r.height = target.height * (area.width / target.width);
			} else {
				r.width = area.width;
				r.height = area.height;
			}
		}
		return noScale(area, r, positionX, positionY);
	};

	layout.noBorder = noBorder = function(area, target, positionX, positionY) {
		var areaRatio, r, targetRatio;
		if (positionX == null) {
			positionX = 0.5;
		}
		if (positionY == null) {
			positionY = 0.5;
		}
		r = {
			x: target.x,
			y: target.y
		};
		if (target.width > 0 && target.height > 0) {
			areaRatio = area.width / area.height;
			targetRatio = target.width / target.height;

			if (areaRatio > targetRatio) {
				r.width = area.width;
				r.height = target.height * (area.width / target.width);
			} else if (areaRatio < targetRatio) {
				r.width = target.width * (area.height / target.height);
				r.height = area.height;
			} else {
				r.width = area.width;
				r.height = area.height;
			}
		}
		return noScale(area, r, positionX, positionY);
	};

	layout.exactFit = exactFit = function(area, target) {
		return {
			x: area.x,
			y: area.y,
			width: area.width,
			height: area.height
		};
	};

	layout.wall = wall = function(area, target, positionX, positionY) {
		if (positionX == null) {
			positionX = 0.5;
		}
		if (positionY == null) {
			positionY = 0.5;
		}
		if (area.width >= target.width && area.height >= target.height) {
			return noScale(area, target, positionX, positionY);
		} else {
			return showAll(area, target, positionX, positionY);
		}
	};

	$.fn.contextualresize = function(options) {
		var method = (options && options['method']) || 'no-scale';
		var selector = (options && options['selector']) || null;

		return this.each(function() {
			var $this = $(this);
			var $parent = selector ? $this.closest(selector) : $this.parent();
			$parent.length || ($parent = $this.parent());

			var f = {
				'no-border': layout.noBorder,
				'show-all': layout.showAll,
				'exact-fit': layout.exactFit,
				'no-scale': layout.noScale,
				'wall': layout.wall
			}[method] || layout.noScale;

			var size = f(
				{
					x: 0,
					y: 0,
					width: $parent.width(),
					height: $parent.height()
				},
				{
					x: 0,
					y: 0,
					width: parseInt($this.attr('width')) || $this.width(),
					height: parseInt($this.attr('height')) || $this.height()
				}
			);

			$this
				.css({
					width: size.width,
					height: size.height
				});
		});
	};
})(jQuery);