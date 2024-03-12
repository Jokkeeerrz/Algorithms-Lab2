import p5 from "p5";

const width: number = 800;
const height: number = 500;
const padding: number = 50;

let sketch = function (p: p5) {
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
    p.line(
      width - padding,
      height - padding,
      width - padding - 5,
      height - padding + 5
    );
    p.line(
      width - padding,
      height - padding,
      width - padding - 5,
      height - padding - 5
    );

    p.strokeWeight(0);
    p.text("(0, 0)", padding + 10, height - 30);
  };

  class Point {
    x: number;
    y: number;
    // p;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    draw(): void {
      // DO NOT MODIFY

      p.stroke("black");
      p.strokeWeight(800);
      p.point(this.x, this.y);
    }

    drawTo(that: Point) {
      // DO NOT MODIFY

      p.stroke("black");
      p.strokeWeight(200);
      p.line(this.x, this.y, that.x, that.y);
    }

    slopeTo(that: Point): number {
      return (that.y - this.y) / (that.x - this.x);
    }
  }

  class LineSegment {
    p: Point;
    q: Point;

    constructor(p: Point, q: Point) {
      // DO NOT MODIFY

      this.p = p;
      this.q = q;
    }

    draw(): void {
      // DO NOT MODIFY

      p.stroke("black");
      p.strokeWeight(2);
      p.line(this.p.x, this.p.y, this.q.x, this.q.y);
    }

    toString(): string {
      // DO NOT MODIFY

      return `${this.p} -> ${this.q}`;
    }
  }

  class BruteCollinearPoints {
    private collinearSegments: LineSegment[] = [];

    constructor(points: Point[]) {
      const n = points.length;

      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          for (let k = j + 1; k < n; k++) {
            for (let l = k + 1; l < n; l++) {
              const slope1 = points[i].slopeTo(points[j]);
              const slope2 = points[i].slopeTo(points[k]);
              const slope3 = points[i].slopeTo(points[l]);

              if (slope1 === slope2 && slope1 === slope3) {
                const minPoint = Math.min(i, j, k, l);
                const maxPoint = Math.max(i, j, k, l);
                const segment = new LineSegment(
                  points[minPoint],
                  points[maxPoint]
                );

                this.collinearSegments.push(segment);
              }
            }
          }
        }
      }
    }

    numberOfSegments(): number {
      return this.collinearSegments.length;
    }

    getSegments(): LineSegment[] {
      return this.collinearSegments;
    }
  }

  class FastCollinearPoints {
    private collinearSegments: LineSegment[] = [];

    constructor(points: Point[]) {
      const n = points.length;

      const sortedPoints = points.slice();

      for (let i = 0; i < n; i++) {
        const origin = points[i];

        sortedPoints.sort((a, b) => origin.slopeTo(a) - origin.slopeTo(b));

        let count = 1;
        let currentSlope = origin.slopeTo(sortedPoints[0]);

        for (let j = 1; j < n; j++) {
          const slope = origin.slopeTo(sortedPoints[j]);

          if (slope === currentSlope) {
            count++;
          } else {
            if (count >= 3) {
              const segment = new LineSegment(origin, sortedPoints[j - 1]);
              this.collinearSegments.push(segment);
            }

            count = 1;
            currentSlope = slope;
          }
        }

        if (count >= 3) {
          const segment = new LineSegment(origin, sortedPoints[n - 1]);
          this.collinearSegments.push(segment);
        }
      }
    }

    numberOfSegments(): number {
      return this.collinearSegments.length;
    }

    getSegments(): LineSegment[] {
      return this.collinearSegments;
    }
  }

  const points: Point[] = [
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

    for (const point of points) {
      point.draw();
    }

    const collinear = new FastCollinearPoints(points);
    for (const segment of collinear.getSegments()) {
      segment.draw();
    }
  };
};

new p5(sketch);
