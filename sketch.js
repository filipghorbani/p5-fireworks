const fireworks = [];
let gravity;

function setup() {
  createCanvas(windowWidth, windowHeight);
  stroke(255);
  strokeWeight(4);
  gravity = createVector(0, 0.2)
  
}

function draw() {
  background(0);

  if( random(1) < 0.1) {
    fireworks.push(new Firework());
  }
  fireworks.forEach((firework, index) => {
    if(firework.done) {
        fireworks.splice(index, 1);
    }
    firework.update();
    firework.show();
  });
}



function Particle(x, y, isParticle) {
    this.isParticle = isParticle;
    this.pos = createVector(x,y);
    if(this.isParticle) {
        this.vel = p5.Vector.random2D();
        this.vel.mult(random(0, 7));
    } else {
        this.vel = createVector(random(-2,2),random(-7,-25));
    }
    this.acc = createVector(0,0);
    this.exploded = false;
    this.lifespan = random(200, 900);
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);

    this.applyForce = function() {
        this.acc.add(gravity);
    }

    this.update = function() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        if(isParticle)
            this.lifespan -= 9;

        if(!this.isParticle && this.vel.y >= 0)
            this.exploded = true;
        if(this.isParticle && this.lifespan <= 0) 
            this.exploded = true;
    }

    this.show = function() {
        stroke(this.r,this.g,this.b);
        //stroke(this.lifespan);
        strokeWeight(this.lifespan/100);
        point(this.pos.x, this.pos.y);
    }
}

function Firework() {
    this.particles = [];
    this.firework = new Particle(random(0, windowWidth),windowHeight, false);

    this.update = function() {
        if(!this.firework.exploded) {
            this.firework.applyForce();
            this.firework.update();

            if(this.firework.exploded) {
                for (let i = 0; i < 50; i++) {
                    this.particles.push(new Particle(this.firework.pos.x, this.firework.pos.y, true));
                }
            }
        } else {
            this.particles.forEach((particle, index) => {
                particle.applyForce();
                particle.update();

                if(particle.exploded) {
                    this.particles.splice(index, 1);
                }
            });
        }
    }

    this.show = function() {
        if(!this.firework.exploded) {
            this.firework.show();
        } else {
            this.particles.forEach((particle, index) => {
                particle.show();
            });
        }
    }
}