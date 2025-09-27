import React from 'react';
import { useRef, useEffect, useState } from "react";
import { TrendingUp,Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { jsPlumb } from "jsplumb";
import gsap from "gsap";
import DotGrid from './dotGrid';
import axios from 'axios';

gsap.registerPlugin(ScrollTrigger);//a plugin is add-on that extends the core functionality of GSAP
//and we need this as we are using scrollTrigger for animating the circles on scroll
//we'll have to define this for every component where we use scrollTrigger

const LandingPage=()=>{
    const navigate=useNavigate();
     const parallaxEnabled = useRef(false);
     const sectionRef = useRef(null);
     const textRef = useRef(null);
   
   useGSAP(()=>{
       gsap.from(".heading", {
           y: 700,
           duration: 1,
           delay:0.5,
           ease: "power3.out",
       });

       gsap.from(".phone", {
           y: 400,
           duration: 1,
           ease: "power3.out",
           
       });

       gsap.from(".rightDiv", {
           scale:0,
           duration: 1,
           delay:1,
           ease: "power3.out",
       });

       gsap.from(".leftDiv", {
           scale:0,
           duration: 1,
           delay:1.3,
           ease: "power3.out",
       });
       
      const counter = { val: 0 }; //just define an object
       gsap.to(counter,{
        val:60,
        duration:1,
        delay:1.5,
        ease: "linear",
        onUpdate: () => { //onUpdate is a function that runs every time the animation updates
                          //Each time counter.val changes (GSAP animates it), onUpdate is triggered
        const el = document.querySelector(".percent");
        el.innerText = `${Math.floor(counter.val)}%`;
        }
       });


       gsap.from(".filled", {
           width:"0px",
           duration: 1,
           delay:1.5,
           ease: "linear",
           onComplete: () => {
               parallaxEnabled.current = true;
           }
       });
   });

   useGSAP(() => {
       const parallaxSection = document.querySelector(".parallaxSection");
       if (!parallaxSection) return;

       const handleMouseMove = (e) => {
           if (!parallaxEnabled.current) return;

           const xMove = (e.clientX / window.innerWidth - 0.5) * 40;
           const yMove = (e.clientY / window.innerHeight - 0.5) * 40;
           gsap.to(".phone",    { x: -xMove * 0.7, y: -yMove * 0.7 });
           gsap.to(".heading",  { x: -xMove * 1.5, y: -yMove * 1.5 });
       };

       const handleMouseLeave = () => {
           if (!parallaxEnabled.current) return;

           gsap.to([".phone", ".heading"], {
               x: 0,
               y: 0,
               duration: 0.5,
               ease: "power2.out",
           });
       };

       parallaxSection.addEventListener("mousemove", handleMouseMove);
       parallaxSection.addEventListener("mouseleave", handleMouseLeave);

       return () => {
         // Cleanup code runs when component unmounts
         //In your case, the component will unmount when:
         // User navigates away from the landing page:
           parallaxSection.removeEventListener("mousemove", handleMouseMove);
           parallaxSection.removeEventListener("mouseleave", handleMouseLeave);
           /*Dead event listeners keep running even after component is gone
             Multiple listeners firing for the same event
             Wasted CPU cycles */
       };
   });

   
 const circleRefs = Array.from({ length: 5 }, () => useRef(null));
 //show when circles come into view
useEffect(() => {
    circleRefs.forEach((ref, index) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%", // when top of circle is 80% from top of viewport
              toggleActions: "play none none none",
            },
            delay: index * 0.01, // stagger effect
          }
        );
      }
    });
  }, []);
  //-------------------------------------------------------------
   useEffect(() => {
  const instance = jsPlumb.getInstance({ Container: sectionRef.current });

  const connectorOptions = {
  connector: ["Bezier", { curviness: 60 }],
  paintStyle: { stroke: "#9e9e9eff", strokeWidth: 2, dashstyle: "6 4" },
  endpoint: "Blank",
  anchors: [[0.5, 1], [0.5, 0.5]] // bottom center of circle → center of text
};


  circleRefs.forEach((ref) => {
    if (ref.current && textRef.current) {
      instance.connect({
        source: ref.current,
        target: textRef.current,
        connector: ["Bezier", { curviness: 60 }],
        paintStyle: { stroke: "#a5a5a5", strokeWidth: 2, dashstyle: "6 4" },
        endpoint: "Blank",
        anchors: [
          [0, 1, 0, 1], // source: horizontal center (0.5), bottom (1)
          [0.5, 0, 0, 0] // target: center of text
          /*
          [x, y, offsetX, offsetY]
          Where:
          x → horizontal fraction of the element (0 = left edge, 0.5 = center, 1 = right edge)
          y → vertical fraction of the element (0 = top edge, 0.5 = middle, 1 = bottom edge)
          offsetX → horizontal pixel offset from that anchor point (+ moves right, - moves left)
          offsetY → vertical pixel offset from that anchor point (+ moves down, - moves up)
          */
        ]
      });
    }
  });

  const handleResize = () => instance.repaintEverything();
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
    instance.reset();
  };
}, []);

  //-------------------------------------------------------------

  //staggered animation for text
  useEffect(() => {
  const letters = textRef.current.querySelectorAll("span");

  gsap.to(letters, {
    y: -30,          // start 20px above
    opacity: 1,      // start invisible
    duration: 0.4,
    stagger: 0.05,   // each letter comes after 0.05s
    ease: "power2.out",
     scrollTrigger: {
              trigger: textRef.current,
              start: "center bottom",
              toggleActions: "play none none none",
            }
  });
}, []);
//---------------------------------------------------------------
const circleRefs2 = Array.from({ length: 5 }, () => useRef(null));
 const sectionRef2 = useRef(null);
 //show when circles come into view
useEffect(() => {
    circleRefs2.forEach((ref, index) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 80%", // when top of circle is 80% from top of viewport
              toggleActions: "play none none none",
            },
            delay: index * 0.01, // stagger effect
          }
        );
      }
    });

    const ctx = gsap.context(() => {
      // Set initial state for numbers
      gsap.set(".number", {
        opacity: 0,
        y: 20
      });
      
      // make section sticky
      ScrollTrigger.create({
        trigger: sectionRef2.current,
        start: "top top",
        end: "+=100%", // length of "stickiness"
        pin: true,     // pin the section
        scrub: true,   // smooth scrubbing
      });

      // animate circles while pinned
      gsap.to(circleRefs2.map((ref, index) => ref.current.parentElement), {
        top: 300, // move down
        left: (index) => {
          const positions = [
            'calc(50% - 150px)',  // graduation cap
            'calc(50% - 90px)',   // heart
            'calc(50% - 30px)',                // list
            'calc(50% + 30px)',   // person
            'calc(50% + 90px)'   // hashtag
          ];
          return positions[index];
        },
        stagger: 0.01,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: sectionRef2.current,
          start: "top top",
          end: "+=100%",
          scrub: true,
        },
        onComplete: () => {
          // Animate numbers appearing
          gsap.to(".number", {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "back.out(1.7)"
          });
        }
      });


    }, sectionRef2);

    return () => ctx.revert();
  }, []);
//---------------------------------------------------------------
const containerRef = useRef(null);
const panelsRef = useRef([]);


useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = panelsRef.current;

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: true,
          end: "+=" + (sections.length - 1) * 100 + "%",
          pinSpacing: true,
        },
      });
    }, containerRef); // 👈 scope everything to this container

    return () => ctx.revert(); // cleanup on unmount
  }, []);
/*Why it can cause chaos with GSAP

Imagine this sequence:
You have a scroll animation attached to .box.
You tweak a CSS value or JS in your component.
Hot Reload swaps in the new code without unmounting the whole page.
React might re-run your component code or patch the DOM.
GSAP doesn’t automatically know “oh, these old animations are invalid now.”
Result: ghost animations, duplicates, weird stuttering.
Basically, Hot Reload = React sneaks behind the curtain and replaces DOM/JS on the fly,
which trips up any JS library that assumes the DOM is static — like GSAP. */

/*
React manages a virtual DOM (JSX) and decides when to patch real DOM nodes.
GSAP doesn’t care about virtual DOM. It only sees the real DOM nodes at that moment.
If React swaps out or re-renders a node, GSAP might be pointing at the old node 
that’s no longer in the DOM → ghost animations, white screens.
That’s why we need gsap.context to tie animations to the scope of your component and clean them up if React changes the DOM.
 */
//---------------------------------------------------------------

return (
  <div className="overflow-x-hidden w-full">
  <section className="relative h-screen overflow-x-hidden  overflow-y-auto snap-y snap-mandatory custom-scrollbar">
    <section className="parallaxSection relative h-[100vh] w-full bg-gradient-to-b from-accent0 to-gray-200 snap-start overflow-hidden flex flex-col items-center justify-end">
      
      {/* Login & Signup Buttons */}
      <div className="fixed z-[100] p-[10px] top-0 right-0">
        <button
          className="login bg-black text-white py-[10px] px-[5px] w-[80px] text-[1.3rem] rounded-md mr-[15px] hover:translate-y-[5px] transition duration-400"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
        <button
          className="signup bg-accent2 text-white py-[9px] px-[5px] w-[80px] text-[1.3rem] rounded-md text-center hover:translate-y-[5px] transition duration-400"
          onClick={() => navigate("/register")}
        >
          Signup
        </button>
      </div>

      {/* Heading */}
      <div className="w-full h-[calc(100%-390px)] flex justify-center items-center max-[575px]:mt-[62px]">
        <p className="heading mt-[20px] mb-[20px] text-[5rem] leading-none text-white text-center inter 
          min-[2201px]:text-[9rem] min-[2201px]:top-[6%] max-[2200px]:top-[4%] min-[2000px]:text-[7rem] min-[1400px]:text-[6rem]
          max-[575px]:text-[4rem]  max-[365px]:text-[3.3rem]">
          Work can be <br /> engaging and efficient
        </p>
      </div>

      {/* Phone and Decorative Cards */}
      <div className="phone-divs h-[350px] relative w-[557px] flex justify-center items-start px-[10px] bottom-[-8%] max-[575px]:w-[350px] max-[365px]:w-[300px]">

        {/* Phone SVG */}
        <div className="phone absolute aspect-[1/2] w-[280px] top-[0] bg-[url('/phone.svg')] bg-contain bg-no-repeat max-[575px]:w-full"></div>

        {/* Right Floating Card */}
        <div className="rightDiv flex items-end absolute w-[200px] aspect-[2/1] bg-gray-200 rounded-lg right-[10px] top-[15%] shadow-lg border-[1px] border-gray-400 max-[575px]:hidden">
          <div className="bg-[url('/graph.png')] bg-cover bg-no-repeat h-[50%] w-full"></div>
          <p className="absolute left-[5px] top-[5px] bg-black rounded-md text-white px-[6px] py-[3px] w-fit flex items-center border-[1px] border-gray-500">
            June
          </p>
          <div className="trendSection flex-col absolute right-[5px] top-[5px]">
            <p className="flex text-[0.9rem] items-center leading-none h-fit">
              4%&nbsp;<TrendingUp className="text-green-500" />
            </p>
            <p className="text-[0.7rem] text-gray-500 leading-none">since may</p>
          </div>
        </div>

        {/* Left Floating Card */}
        <div className="leftDiv absolute w-[200px] aspect-[2/1] bg-gray-200 rounded-lg left-[10px] bottom-[20%] shadow-lg p-[10px] border-[1px] border-gray-400 max-[575px]:hidden">
          <section className="w-full h-[50%] flex">
            <div className="pfp h-full aspect-square rounded-full bg-gray-500 bg-[url('/pfp.png')] bg-cover bg-no-repeat border-[1px] border-gray-400"></div>
            <p className="flex items-center w-full text-[1.2rem] pl-[10px]">Hello Liam!</p>
          </section>
          <section className="h-[50%] w-full flex flex-col justify-center">
            <p className="w-full text-[0.8rem] text-gray-500 leading-none mb-[5px]">
              Your Progress &nbsp;
              <span className="percent text-accent0 leading-none"></span>
            </p>
            <div className="total h-[10px] w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="filled h-full w-[60%] bg-accent1"></div>
            </div>
          </section>
        </div>
      </div>

      {/* GitHub Button */}
      <button
        onClick={() => window.open('https://github.com/stimpy3/Tac', '_blank')}
        className="fixed z-[100] w-[50px] aspect-square shadow-lg flex items-center justify-center bg-white p-[10px] bottom-[30px] right-[30px] rounded-full hover:bg-black hover:text-white transition-all hover:scale-[1.2] duration-300 
        max-[575px]:bottom-[10px] max-[575px]:right-[10px] max-[830px]:w-[70px] max-[830px]:p-[15px]"
      >
        <Github className="w-full h-full" />
      </button>
    </section>
    {/*gradient bottom*/}
    <section className="absolute bottom-0 z-[10] h-[100px] w-full  bg-gradient-to-b from-transparent to-gray-200"></section>
  </section>

   <div className="pinWrapper relative h-[100vh] bg-[radial-gradient(circle_at_bottom_center,white_0%,white_50%,#e7e5eb_65%)]">
     {/* DotGrid background */}
  <div className="absolute inset-0 z-5">
    <DotGrid
      dotSize={3}
      gap={15}
      baseColor="#d1d5db"
      activeColor="#454545ff"
      proximity={120}
      shockRadius={250}
      shockStrength={5}
      resistance={750}
      returnDuration={1.5}
    />
  </div>

  <section ref={sectionRef} className="circleSection h-[100vh] w-full  flex justify-center relative">
  {/* Wrapper for animation */}
    <div ref={circleRefs[0]} className="absolute z-[10] top-[100px] shadow-xl left-[50%] -translate-x-1/2 w-[60px] h-[60px] text-[1.5rem] text-white rounded-full flex items-center justify-center p-[10px] bg-[#4592ff]">
      <i class="fa-solid fa-graduation-cap"></i>
    </div>

    <div ref={circleRefs[1]} className="absolute z-[10] top-[250px] shadow-xl left-[55%] -translate-x-1/2 w-[60px] h-[60px] text-[1.5rem] text-white rounded-full flex items-center justify-center p-[10px] bg-[#e872e8]">
      <i class="fa-regular fa-heart"></i>
    </div>

    <div ref={circleRefs[2]} className="absolute z-[10] top-[210px] shadow-xl left-[65%] -translate-x-1/2 w-[60px] h-[60px] text-[1.5rem] text-white rounded-full flex items-center justify-center p-[10px] bg-[#62b035]">
      <i class="fa-solid fa-list"></i>
    </div>

    <div ref={circleRefs[3]} className="absolute z-[10] top-[180px] shadow-xl left-[35%] -translate-x-1/2 w-[60px] h-[60px] text-[1.5rem] text-white rounded-full flex items-center justify-center p-[10px] bg-[#fc357d]">
      <i class="fa-solid fa-user"></i>
    </div>

    <div ref={circleRefs[4]} className="absolute z-[10] top-[300px] shadow-xl left-[45%] -translate-x-1/2 w-[60px] h-[60px] text-[1.5rem] text-white rounded-full flex items-center justify-center p-[10px] bg-[#685ffa]">
      <i class="fa-solid fa-hashtag"></i>
    </div>

    <div ref={textRef} className="text-[#3e3e3eff] absolute bottom-[50px]  left-0 w-full flex justify-center">
        {"Noise without Direction".split("").map((char, i) => (
         <span key={i} className="inline-block opacity-0 text-[3rem] max-[560px]:text-[2rem] max-[530px]:text-[1.5rem]">{(char==" ")?"\u00A0":char}</span>
         ))}
    </div>

  </section>
  {/*gradient bottom*/}
    <section className="absolute bottom-0 z-50 h-[50px] w-full  bg-gradient-to-b from-[rgba(0,0,0,0)_30%] to-[#232323ff]"></section>
</div>

<section ref={sectionRef2} className='bg-daccentS w-full h-[100vh] flex justify-center overflow-hidden'>
  <div className="relative h-full overflow-y-hidden w-[100%] max-w-[800px] flex flex-col items-center px-[20px] text-center overflow-x-hidden">
    <h2 className="text-[2.5rem] max-[600px]:text-[1.5rem] text-white font-semibold mt-[80px]">But what if you could turn that noise into order?</h2>
   
    <div className="absolute z-[10] top-[200px] left-[50%] max-[500px]:left-[calc(50%-30px)] flex flex-col items-center">
      <div ref={circleRefs2[0]} className="shadow-xl w-[60px] h-[60px] text-[1.5rem] text-white rounded-full flex items-center justify-center p-[10px] bg-[#4592ff]">
        <i class="fa-solid fa-graduation-cap"></i>
      </div>
      <span className="number text-white mt-[5px] text-2xl opacity-0">1</span>
    </div>

    <div className="absolute z-[10] top-[350px] left-[calc(50%+50px)] max-[500px]:left-[calc(50% - 10px)] flex flex-col items-center">
      <div ref={circleRefs2[1]} className="shadow-xl w-[60px] h-[60px] text-[1.5rem] text-white rounded-full flex items-center justify-center p-[10px] bg-[#e872e8]">
        <i class="fa-regular fa-heart"></i>
      </div>
      <span className="number text-white mt-[5px] text-2xl opacity-0">2</span>
    </div>

    <div className="absolute z-[10] top-[310px] left-[calc(50%-100px)] max-[500px]:left-[calc(50% - 70px)] flex flex-col items-center">
      <div ref={circleRefs2[2]} className="shadow-xl w-[60px] h-[60px] text-[1.5rem] text-white rounded-full flex items-center justify-center p-[10px] bg-[#62b035]">
        <i class="fa-solid fa-list"></i>
      </div>
      <span className="number text-white mt-[5px] text-2xl opacity-0">3</span>
    </div>

    <div className="absolute z-[10] top-[280px] left-[calc(50%+160px)] max-[500px]:left-[calc(50%+100px)] flex flex-col items-center">
      <div ref={circleRefs2[3]} className="shadow-xl w-[60px] h-[60px] text-[1.5rem] text-white rounded-full flex items-center justify-center p-[10px] bg-[#fc357d]">
        <i class="fa-solid fa-user"></i>
      </div>
      <span className="number text-white mt-[5px] text-2xl opacity-0">4</span>
    </div>

    <div className="absolute z-[10] top-[400px] left-[calc(50%-160px)] max-[500px]:left-[calc(50%-150px)] flex flex-col items-center">
      <div ref={circleRefs2[4]} className="shadow-xl w-[60px] h-[60px] text-[1.5rem] text-white rounded-full flex items-center justify-center p-[10px] bg-[#685ffa]">
        <i class="fa-solid fa-hashtag"></i>
      </div>
      <span className="number text-white mt-[5px] text-2xl opacity-0">5</span>
    </div>

  </div>
  
</section>

<div ref={containerRef} className="flex overflow-hidden">{/*container for animated horizontal scroll start */}
    
    <section ref={(el) => (panelsRef.current[0] = el)} className='flex-none w-full h-screen'>{/*flex-none prevents grow and shrink */}
      <div className="h-[100vh] w-full bg-daccentS flex flex-col items-center justify-center px-[20px] text-center">
        <p className="text-[2.2rem] max-[600px]:text-[1.5rem] font-semibold text-white">Your scattered tasks, now aligned into a clear timeline.</p>
        <figure className="mt-[20px] aspect-[1797/841] w-[95%] bg-[url('/ttPic.png')] max-[500px]:aspect-[605/679] max-[500px]:h-[80%] max-[500px]:bg-[url('/ttPicSmall.png')] bg-contain bg-no-repeat bg-center"></figure>
      </div>
    </section>
    
    <section ref={(el) => (panelsRef.current[1] = el)} className='flex-none w-full h-screen'>{/*flex-none prevents grow and shrink */}
      <div className="h-[100vh] w-full bg-daccentS flex flex-col items-center justify-center px-[20px] text-center">
        <p className="text-[3rem] mb-[30px] max-[600px]:text-[1.5rem] font-semibold text-white">No clutter. Just today’s focus.</p>
        <figure className="max-w-[1000px] w-[100%] aspect-[1340/239] bg-[url('/todayTt.png')] max-[500px]:aspect-[799/267] max-[500px]:bg-[url('/todayTtSmall.png')] bg-contain bg-no-repeat bg-center"></figure>
      </div>
    </section>
    
    <section ref={(el) => (panelsRef.current[2] = el)} className='flex-none w-full h-screen'>{/*flex-none prevents grow and shrink */}
      <div className="h-[100vh] w-full bg-daccentS flex flex-col items-center justify-center px-[20px] text-center">
        <p className="text-[2.5rem] mb-[30px] max-[600px]:text-[1.5rem] font-semibold text-white">Your tasks and deadlines, organized right on the calendar.</p>
        <div className="flex justify-center w-full h-[60%] max-[510px]:flex-col max-[510px]:items-center gap-4">
           <figure className="w-[250px] max-[510px]:h-[60%] aspect-[398/249] bg-[url('/deadline.png')] bg-contain bg-no-repeat bg-center"></figure>
           <figure className="w-[250px] max-[510px]:h-[60%] aspect-[397/455] bg-[url('/calendar.png')] bg-contain bg-no-repeat bg-center"></figure>
        </div> 
      </div>
    </section>

</div>{/*container for animated horizontal scroll end */}

 {/*Footer part*/}
 <footer className="bg-accentTxt text-gray-300 py-8">
  <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
    

    <div className="text-center md:text-left">
      <h2 className="text-xl font-semibold text-white">Tac</h2>
      <p className="text-sm text-gray-400">Productivity, simplified.</p>
    </div>

    <div className="flex gap-6 text-sm">
      <a href="#" className="hover:text-white">Features</a>
      <a href="#" className="hover:text-white">About</a>
      <a href="#" className="hover:text-white">Contact</a>
      <a href="#" className="hover:text-white">FAQ</a>
    </div>
  </div>

  <div className="mt-6 text-center text-xs text-gray-500">
    © 2025 Tac. All rights reserved.
  </div>
</footer>
  </div>
);


};

export default LandingPage;