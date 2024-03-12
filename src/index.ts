import p5 from "p5";

const width: number = 800;
const height: number = 500;
const padding: number = 50;

let sketch = function (p) {
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
    p;

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

      return `${this.p} -> ${this.q}`
    }
  }

  class BruteCollinearPoints {
    constructor(points: Point[]) {
      // YOUR CODE HERE
    }

    numberOfSegments(): number {
      // YOUR CODE HERE
    }

    segments(): LineSegment[] {
      // YOUR CODE HERE
    }
  }

  class FastCollinearPoints {
    private segmentsList: LineSegment[] = [];
  
    constructor(points: Point[]) {
      if (!points || points.includes(null)) {
        throw new Error("Argument to constructor cannot be null, and points array cannot contain null elements.");
      }
  
      // Check for repeated points
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          if (points[i].x === points[j].x && points[i].y === points[j].y) {
            throw new Error("Repeated points are not allowed.");
          }
        }
      }
  
      // Sort the points to maintain the order of original points
      const sortedPoints = points.slice().sort((a, b) => {
        if (a.y !== b.y) {
          return a.y - b.y;
        }
        return a.x - b.x;
      });
  
      const n = sortedPoints.length;
  
      for (let i = 0; i < n; i++) {
        const p = sortedPoints[i];
        const slopes: { [slope: number]: Point[] } = {};
  
        // Sort the points according to slopes with respect to p
        for (let j = 0; j < n; j++) {
          if (j === i) continue;
          const q = sortedPoints[j];
          const slope = p.slopeTo(q);
  
          if (!slopes[slope]) {
            slopes[slope] = [];
          }
          slopes[slope].push(q);
        }
  
        // Check for collinear points
        for (const slope in slopes) {
          const collinearPoints = slopes[slope];
          if (collinearPoints.length >= 3) {
            collinearPoints.push(p);
            collinearPoints.sort((a, b) => a.compareTo(b)); // Ensure consistent order
            if (p.compareTo(collinearPoints[0]) === 0) {
              this.segmentsList.push(new LineSegment(collinearPoints[0], collinearPoints[collinearPoints.length - 1]));
            }
          }
        }
      }
    }
  
    numberOfSegments(): number {
      return this.segmentsList.length;
    }
  
    segments(): LineSegment[] {
      return this.segmentsList.slice(); // Return a copy to avoid modifying the internal state
    }
  }
  

  // Declare your point objects here~
  // const point = new Point(19000, 10000);
  // const point2 = new Point(10000, 10000);

  // from input6.txt
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
    p.scale(1/100, -1/100);

    // Call your draw and drawTo here.

    // point.draw();
    // point2.draw();
    // point.drawTo(point2);

    for (const point of points) {
      point.draw();
    }

    const collinear = new FastCollinearPoints(points);
    for (const segment of collinear.segments()) {
      console.log(segment.toString());
      segment.draw();
    }
  };
};

new p5(sketch);
