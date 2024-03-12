import p5 from "p5";

const width: number = 800;
const height: number = 500;
const padding: number = 50;

let sketch = function (p: p5) {
  function mergeSort(arr: Point[]): Point[] {
    if (arr.length <= 1) {
      return arr;
    }

    const mid = Math.floor(arr.length / 2);
    const left = arr.slice(0, mid);
    const right = arr.slice(mid);

    return merge(mergeSort(left), mergeSort(right));
  }

  function merge(left: Point[], right: Point[]): Point[] {
    let result: Point[] = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < left.length && rightIndex < right.length) {
      if (left[leftIndex].x < right[rightIndex].x) {
        result.push(left[leftIndex]);
        leftIndex++;
      } else {
        result.push(right[rightIndex]);
        rightIndex++;
      }
    }

    return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
  }

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
    p: p5;

    constructor(x: number, y: number, p: p5) {
      this.x = x;
      this.y = y;
      this.p = p;
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
      if (this.x === that.x && this.y === that.y) {
        return Number.NEGATIVE_INFINITY;
      }

      if (this.x === that.x) {
        return Number.POSITIVE_INFINITY;
      }

      if (this.y === that.y) {
        return 0;
      }
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

        // Create a copy of sortedPoints before sorting
        const sortedCopy = sortedPoints.slice();

        sortedCopy.sort((a, b) => origin.slopeTo(a) - origin.slopeTo(b));

        let count = 1;
        let currentSlope = origin.slopeTo(sortedCopy[0]);

        for (let j = 1; j < n; j++) {
          const slope = origin.slopeTo(sortedCopy[j]);

          if (slope === currentSlope) {
            count++;
          } else {
            if (count >= 3) {
              const segment = new LineSegment(origin, sortedCopy[j - 1]);
              this.collinearSegments.push(segment);
            }

            count = 1;
            currentSlope = slope;
          }
        }

        if (count >= 3) {
          const segment = new LineSegment(origin, sortedCopy[n - 1]);
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

  // Declare your point objects here~
  const point = new Point(1234, 5678, p);
  const point2 = new Point(32000, 10000, p);

  // from input6.txt
  const points: Point[] = [
    new Point(19000, 10000, p),
    new Point(18000, 10000, p),
    new Point(32000, 10000, p),
    new Point(21000, 10000, p),
    new Point(1234, 5678, p),
    new Point(14000, 10000, p),
  ];

  p.draw = function () {
    p.translate(padding, height - padding);
    p.scale(1 / 100, -1 / 100);

    point.draw();
    point2.draw();
    point.drawTo(point2);

    const sortedPoints = mergeSort(points);

    for (const point of sortedPoints) {
      point.draw();
    }

    const collinear = new FastCollinearPoints(points);
    for (const segment of collinear.getSegments()) {
      console.log(segment.toString());
      segment.draw();
    }
  };
};

new p5(sketch);
