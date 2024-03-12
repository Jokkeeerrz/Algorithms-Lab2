"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var p5_1 = require("p5");
var width = 800;
var height = 500;
var padding = 50;
var sketch = function (p) {
    p.setup = function () {
        p.createCanvas(width, height);
        p.strokeWeight(3);
        p.stroke("blue");
        // x and y axes
        p.line(padding, padding, padding, height - padding);
        p.line(padding, height - padding, width - padding, height - padding);
        // y-axis arrow head
        p.line(padding, padding, padding - 5, padding + 5);
        p.line(padding, padding, padding + 5, padding + 5);
        // x-axis arrow head
        p.line(width - padding, height - padding, width - padding - 5, height - padding + 5);
        p.line(width - padding, height - padding, width - padding - 5, height - padding - 5);
        p.strokeWeight(0);
        p.text("(0, 0)", padding + 10, height - 30);
    };
    var Point = /** @class */ (function () {
        // p;
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        Point.prototype.draw = function () {
            // DO NOT MODIFY
            p.stroke("black");
            p.strokeWeight(800);
            p.point(this.x, this.y);
        };
        Point.prototype.drawTo = function (that) {
            // DO NOT MODIFY
            p.stroke("black");
            p.strokeWeight(200);
            p.line(this.x, this.y, that.x, that.y);
        };
        Point.prototype.slopeTo = function (that) {
            return (that.y - this.y) / (that.x - this.x);
        };
        return Point;
    }());
    var LineSegment = /** @class */ (function () {
        function LineSegment(p, q) {
            // DO NOT MODIFY
            this.p = p;
            this.q = q;
        }
        LineSegment.prototype.draw = function () {
            // DO NOT MODIFY
            p.stroke("black");
            p.strokeWeight(2);
            p.line(this.p.x, this.p.y, this.q.x, this.q.y);
        };
        LineSegment.prototype.toString = function () {
            // DO NOT MODIFY
            return "".concat(this.p, " -> ").concat(this.q);
        };
        return LineSegment;
    }());
    var BruteCollinearPoints = /** @class */ (function () {
        function BruteCollinearPoints(points) {
            this.collinearSegments = [];
            var n = points.length;
            for (var i = 0; i < n; i++) {
                for (var j = i + 1; j < n; j++) {
                    for (var k = j + 1; k < n; k++) {
                        for (var l = k + 1; l < n; l++) {
                            var slope1 = points[i].slopeTo(points[j]);
                            var slope2 = points[i].slopeTo(points[k]);
                            var slope3 = points[i].slopeTo(points[l]);
                            if (slope1 === slope2 && slope1 === slope3) {
                                var minPoint = Math.min(i, j, k, l);
                                var maxPoint = Math.max(i, j, k, l);
                                var segment = new LineSegment(points[minPoint], points[maxPoint]);
                                this.collinearSegments.push(segment);
                            }
                        }
                    }
                }
            }
        }
        BruteCollinearPoints.prototype.numberOfSegments = function () {
            return this.collinearSegments.length;
        };
        BruteCollinearPoints.prototype.getSegments = function () {
            return this.collinearSegments;
        };
        return BruteCollinearPoints;
    }());
    var FastCollinearPoints = /** @class */ (function () {
        function FastCollinearPoints(points) {
            this.collinearSegments = [];
            var n = points.length;
            var sortedPoints = points.slice();
            var _loop_1 = function (i) {
                var origin_1 = points[i];
                sortedPoints.sort(function (a, b) { return origin_1.slopeTo(a) - origin_1.slopeTo(b); });
                var count = 1;
                var currentSlope = origin_1.slopeTo(sortedPoints[0]);
                for (var j = 1; j < n; j++) {
                    var slope = origin_1.slopeTo(sortedPoints[j]);
                    if (slope === currentSlope) {
                        count++;
                    }
                    else {
                        if (count >= 3) {
                            var segment = new LineSegment(origin_1, sortedPoints[j - 1]);
                            this_1.collinearSegments.push(segment);
                        }
                        count = 1;
                        currentSlope = slope;
                    }
                }
                if (count >= 3) {
                    var segment = new LineSegment(origin_1, sortedPoints[n - 1]);
                    this_1.collinearSegments.push(segment);
                }
            };
            var this_1 = this;
            for (var i = 0; i < n; i++) {
                _loop_1(i);
            }
        }
        FastCollinearPoints.prototype.numberOfSegments = function () {
            return this.collinearSegments.length;
        };
        FastCollinearPoints.prototype.getSegments = function () {
            return this.collinearSegments;
        };
        return FastCollinearPoints;
    }());
    var points = [
        new Point(19000, 10000),
        new Point(18000, 10000),
        new Point(32000, 10000),
        new Point(21000, 10000),
        new Point(1234, 5678),
        new Point(14000, 10000),
    ];
    p.draw = function () {
        p.translate(padding, height - padding);
        p.scale(1 / 100, -1 / 100);
        for (var _i = 0, points_1 = points; _i < points_1.length; _i++) {
            var point = points_1[_i];
            point.draw();
        }
        var collinear = new FastCollinearPoints(points);
        for (var _a = 0, _b = collinear.getSegments(); _a < _b.length; _a++) {
            var segment = _b[_a];
            segment.draw();
        }
    };
};
new p5_1.default(sketch);
