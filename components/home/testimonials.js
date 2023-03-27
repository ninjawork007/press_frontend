import { useState } from "react";
import cx from "classnames";
import { ArrowRightIcon } from "@heroicons/react/outline";

// =========================
// Slide
// =========================

const testimonials = [
  {
    content:
      "My practice saw an explosion of subscriptions when we were featured on Mens Journal. Presscart made that happen. Since then, we’ve been getting 5-7 strong hits a month and it’s predictable.",
    name: "Michael Fischer",
    company: "Elite HRT",
    logo: "https://press-bucket.s3.ca-central-1.amazonaws.com/Logo_Elite_HRT_Theme_Color_56dbd044c0.png?updated_at=2023-01-09T02:02:25.062Z",
  },
  {
    content:
      "Obtaining press in the Cannabis industry is historically difficult. Publicity purchasing with Presscart got us coverage in many major outlets and it’s dramatically changed our online visibility.",
    name: "Adam Levin",
    logo: "https://press-bucket.s3.ca-central-1.amazonaws.com/Logo_High_Times_Theme_Color_fa7cb0f96d.png?updated_at=2023-01-09T02:02:25.195Z",
  },
  {
    content:
      "The press we’ve acquired and continue to acquire with Presscart has dramatically helped in increasing our brands credibility online. Being in the medical field, this is critically important. Our keyword rankings have skyrocketed as a result of this positive press coverage.",
    name: "Chris Riley",
    logo: "https://press-bucket.s3.ca-central-1.amazonaws.com/Logo_US_Arx_Theme_Color_f3c1dfce38.png?updated_at=2023-01-09T01:59:30.220Z",
  },
  {
    content:
      "Working with Presscart has allowed us to secure incredibly high-quality press that PR agencies were never able to do. We will be using them exclusively for all of our publicity purchasing going forward.",
    name: "Oli Walsh",
    logo: "https://press-bucket.s3.ca-central-1.amazonaws.com/Logo_Asystem_Theme_Color_116b723d5d.png?updated_at=2023-01-09T01:59:30.240Z",
  },
  {
    content:
      "The links and press we have been able to acquire from Presscart have transformed how our business looks online when you google our brand name, not to mention delivering a significant amount of new organic traffic.",
    name: "Remon Aziz",
    logo: "https://press-bucket.s3.ca-central-1.amazonaws.com/Logo_Advantage_Rent_a_car_Theme_Color_73bc1119d3.png?updated_at=2023-01-09T01:59:30.231Z",
  },
];

function Slide({ slide, current, handleSlideClick, index }) {
  const handleMouseMove = (event) => {
    const el = slide.current;
    const r = el.getBoundingClientRect();

    el.style.setProperty(
      "--x",
      event.clientX - (r.left + Math.floor(r.width / 2))
    );
    el.style.setProperty(
      "--y",
      event.clientY - (r.top + Math.floor(r.height / 2))
    );
  };

  const handleMouseLeave = (event) => {
    slide.current.style.setProperty("--x", 0);
    slide.current.style.setProperty("--y", 0);
  };

  const imageLoaded = (event) => {
    event.target.style.opacity = 1;
  };

  const { src, headline } = slide;
  let classNames = "slide mx-2 image";

  if (current === index) classNames += " slide--current";
  else if (current - 1 === index) classNames += " slide--previous";
  else if (current + 1 === index) classNames += " slide--next";

  return (
    <li
      className={classNames}
      onClick={() => handleSlideClick(index)}
      //   onMouseMove={handleMouseMove}
      //   onMouseLeave={handleMouseLeave}
    >
      <div className="slide__image-wrapper">
        <div
          className={`${index == 0 ? "active" : ""} h-full`}
          key={index}
          data-anchor={`review-${index}`}
          data-reviewindex={index}
        >
          <div className="p-6 sm:p-12 bg-gradient-to-b from-[#FEFDFE] to-[#F8F7FC] rounded-[48px] h-full flex flex-col items-start">
            <p className="text-base sm:text-xl text-gray-700 grow mt-1">{`"${slide.content}"`}</p>

            <div className="flex flex-row items-center w-full">
              {/* <div className="rounded-full overflow-hidden">
                <img src={slide.personImg} alt="profile" className="w-6 h-6" />
              </div> */}
              <div className="w-full">
                <div className="flex justify-between w-full items-center">
                  <div className="flex flex-row gap-2 justify-center">
                    {/* <img src="/Avatar.png" alt="Yotpo" /> */}
                    <div className="flex flex-col justify-center">
                      <p className="text-sm font-bold text-gray-700">
                        {slide.name}
                      </p>
                      <p className="text-sm text-gray-700">{slide.position}</p>
                    </div>
                  </div>
                  <img src={slide.logo} alt="profile" className="h-12" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function SlideCircle({ slide, current, handleSlideClick, index }) {
  const handleMouseMove = (event) => {
    const el = slide.current;
    const r = el.getBoundingClientRect();

    el.style.setProperty(
      "--x",
      event.clientX - (r.left + Math.floor(r.width / 2))
    );
    el.style.setProperty(
      "--y",
      event.clientY - (r.top + Math.floor(r.height / 2))
    );
  };

  const handleMouseLeave = (event) => {
    slide.current.style.setProperty("--x", 0);
    slide.current.style.setProperty("--y", 0);
  };

  const imageLoaded = (event) => {
    event.target.style.opacity = 1;
  };

  let classNames = "slide";

  if (current === index) classNames += " slide--current";
  else if (current - 1 === index) classNames += " slide--previous";
  else if (current + 1 === index) classNames += " slide--next";

  return (
    <li
      style={{ width: "10px", height: "10px" }}
      className={classNames}
      onClick={() => handleSlideClick(index)}
      //   onMouseMove={handleMouseMove}
      //   onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center">
        <div
          className={cx(
            `rounded-full h-[10px] w-[10px]`,
            current === index ? "bg-gray-900" : "bg-gray-600"
          )}
        ></div>
      </div>
    </li>
  );
}

// =========================
// Slider control
// =========================

const SliderControl = ({ type, title, handleClick }) => {
  return (
    <button
      className={`btn btn--${type} flex items-center justify-center !bg-white !border-1 !border-gray-100`}
      title={title}
      onClick={handleClick}
    >
      <ArrowRightIcon className="h-5 w-5 text-gray-600" />
    </button>
  );
};

// =========================
// Slider
// =========================

function Slider({ slides }) {
  const [current, setCurrent] = useState(1);
  const handlePreviousClick = () => {
    const previous = current - 1;

    setCurrent(previous < 0 ? slides.length - 1 : previous);
  };

  const handleNextClick = () => {
    const next = current + 1;

    setCurrent(next === slides.length ? 0 : next);
  };

  const handleSlideClick = (index) => {
    if (current !== index) {
      setCurrent(index);
    }
  };

  const wrapperTransform = {
    transform: `translateX(-${current * (100 / slides.length)}%)`,
  };

  return (
    <div className="w-full space-y-10 mt-10">
      <div className="slider">
        <ul className="slider__wrapper" style={wrapperTransform}>
          {slides.map((slide, index) => {
            return (
              <Slide
                key={index}
                index={index}
                slide={slide}
                current={current}
                handleSlideClick={handleSlideClick}
              />
            );
          })}
        </ul>
      </div>
      <div className="slider__controls">
        <div className="max-w-[214px] sm:max-w-none overflow-hidden flex items-center">
          <ul className="flex items-center justify-center gap-3 ">
            {slides.map((slide, index) => {
              return (
                <SlideCircle
                  key={index}
                  index={index}
                  slide={slide}
                  current={current}
                  handleSlideClick={handleSlideClick}
                />
              );
            })}
          </ul>
        </div>
        <div className="flex items-center justify-center gap-3">
          <SliderControl
            type="previous"
            title="Go to previous slide"
            handleClick={handlePreviousClick}
          />
          <SliderControl
            type="next"
            title="Go to next slide"
            handleClick={handleNextClick}
          />
        </div>
      </div>
    </div>
  );
}

export default function Reviews({ reviews, averageRating }) {
  return (
    <div className="overflow-hidden ">
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-32">
        <p class="lg:text-center font-extrabold text-transparent text-base bg-clip-text bg-gradient-to-r from-[#352BFD] to-[#E581BF] mb-[16px]">
          Testimonials
        </p>
        <h2 className="text-4xl lg:text-5xl text-gray-900 tracking-tight capitalize lg:text-center">
          What Our Clients Say
        </h2>
        <Slider slides={testimonials} />
      </div>
    </div>
  );
}
