/* This example requires Tailwind CSS v2.0+ */
import { AnnotationIcon, GlobeAltIcon, LightningBoltIcon, MailIcon, ScaleIcon } from '@heroicons/react/outline'
import { useState,useEffect } from 'react';
export default function Example({reviews, averageRating}) {
    const [idle, setIdle] = useState(false)

    useEffect(() => {
        //set initial NFT to active
        // let wrapper = document.querySelector("#review-slides");
        // let items = wrapper.querySelectorAll(".review-slide");
        // alert(items.length)
        // items[0].classList.add("active");
        // items[1] && items[1].classList.add("next");
     
    
    
      }, []);

    const addClasses = (nodeList, cssClasses) => {
        for (let i = 0; i < nodeList.length; i++) {
          nodeList[i].classList.add(...cssClasses);
        }
      }
    
      const removeClasses = (nodeList, cssClasses) => {
        for (let i = 0; i < nodeList.length; i++) {
          nodeList[i].classList.remove(...cssClasses);
        }
      }

    
      const waitForFAQIdle = (e) => {
        e.preventDefault();
    
        //set timeout to make sure extra scrolls doesn't fire
        setTimeout(() => {
            setIdle(true)
        }, 500);
      }


    
      const handleFAQSlide = () => {

        let main = document.querySelector("#review-slides");
        let items = main.querySelectorAll(".review-slide");
        let total = items.length;
    
        let activeFAQSlideIndex = activeFAQSlideIndex;
        let direction = "next";
        let previousDirection = wrapper.classList.contains("prev")
          ? "prev"
          : "next";
        let didChangeDirection = previousDirection !== direction;
    
        setIdle(false)
        wrapper.classList.remove("prev", "next");
        if (direction == "next") {
          activeFAQSlideIndex = (activeFAQSlideIndex + 1) % total;
          wrapper.classList.add("next");
        } else {
          activeFAQSlideIndex = (activeFAQSlideIndex - 1 + total) % total;
          wrapper.classList.add("prev");
        }
    
        //reset classes
        removeClasses(items, ["prev", "active", "next"]);
    
        //set prev
        const prevItems = [...items].filter((item) => {
          let prevIndex;
          if (wrapper.classList.contains("prev")) {
            prevIndex =
              activeFAQSlideIndex == total - 1 ? 0 : activeFAQSlideIndex + 1;
          } else {
            prevIndex =
              activeFAQSlideIndex == 0 ? total - 1 : activeFAQSlideIndex - 1;
          }
    
          return item.dataset.faqindex == prevIndex;
        });
    
        //set next
        const nextItems = [...items].filter((item) => {
          let nextIndex;
          if (wrapper.classList.contains("next")) {
            nextIndex =
              activeFAQSlideIndex == total + 1 ? 0 : activeFAQSlideIndex + 1;
          } else {
            nextIndex =
              activeFAQSlideIndex == 0 ? total + 1 : activeFAQSlideIndex - 1;
          }
    
          return item.dataset.faqindex == nextIndex;
        });
    
        //set active
        const activeItems = [...items].filter((item) => {
          return item.dataset.faqindex == activeFAQSlideIndex;
        });
    
        if (didChangeDirection) {
          addClasses(nextItems, ["transition"]);
        }
    
        addClasses(prevItems, ["prev"]);
    
        addClasses(nextItems, ["next"]);
    
        addClasses(activeItems, ["active"]);
    
        const activeSlide = main.querySelector(".active");
    
        activeFAQSlideIndex = activeFAQSlideIndex;
    
        activeSlide.addEventListener(
          "transitionend",
          waitForFAQIdle.bind(this),
          {
            once: true,
          }
        );
      }

  return (
    <div className="bg-indigo-50 overflow-hidden ">

    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-32 ">
        <div className="flex flex-col sm:flex-row items-center justify-between">
            <h1 className="text-3xl text-gray-900 pt-4">Real Reviews From Real Customers</h1>
            <div className="flex items-center gap-2">
            <p className="shrink-0">
                Rated {averageRating} 
            </p>
            <img src="/stars.svg" className="h-6"/>

            <p className="shrink-0">based on {48} reviews on</p> 

            <img src="/Yotpo.png" className="w-8"/>
            </div>
          
        </div>
        <div id="review-slides" className="mt-12 flex gap-6 overflow-scroll ">
            {reviews.map((review, index) => (
                <div classNames={`review-slide ${index == 0 ? "active" : ""}`}
                key={index}
                data-anchor={`review-${index}`}
                data-reviewindex={index}
            >
                <div className="w-[416px] py-6 px-6 bg-white/[.75] rounded-md h-full flex flex-col items-start">
                    <img className="h-4 grow-0" src={`/stars/stars-${review.score}.svg`}/>
                    <p className="text-md font-bold text-gray-700 mt-4">{review.title}</p>
                    <p className="text-base text-gray-700 grow mt-1">{review.content}</p>

                    <div className="flex items-center gap-2 mt-4">
                        <p className="text-base font-bold text-gray-700 capitalize">{review.name.replace("@waverly.co", "")}</p>
                        <div className="flex items-center justify-center gap-1">
                        <p className="text-indigo-500">Verified Buyer</p>
                        <img src="/verified.svg"/>
                        </div>
                    </div>

                </div>
            </div>
            ))}
        </div>
    </div>
    </div>

  )
}
