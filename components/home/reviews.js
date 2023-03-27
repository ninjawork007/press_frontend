import { useState } from "react";
import cx from "classnames";
import { ArrowRightIcon } from "@heroicons/react/outline";
// =========================
// Slide
// =========================

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
          <div className="py-6 px-6 bg-white/[.75] rounded-md h-full flex flex-col items-start">
            <img className="h-4 grow-0" src={`/stars-${slide.score}.svg`} />
            <p className="text-base font-bold text-gray-700 mt-4">
              {slide.title}
            </p>
            <p className="text-base text-gray-700 grow mt-1">{slide.content}</p>

            <div className="flex gap-2 mt-4">
              <p className="text-base font-bold text-gray-700 capitalize">
                {slide.name.replace("@waverly.co", "")}
              </p>
              <div className="flex items-center justify-center gap-1">
                <p className="text-indigo-500">Verified Buyer</p>
                <img src="/verified.svg" />
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
            `rounded-full h-2 w-2`,
            current === index ? "bg-gray-900" : "bg-gray-300"
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
      className={`btn btn--${type} flex items-center justify-center`}
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
  const [current, setCurrent] = useState(3);
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
  let slideData = [];
  slideData = reviews?.map((review) => {
    return {
      title: review.title,
      content: review.content,
      name: review.name,
      score: review.score,
    };
  });

  return (
    <div className="bg-indigo-50 overflow-hidden ">
      <div className="max-w-7xl mx-auto px-4 py-16 lg:py-32">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl text-gray-900">
            What Our Customers are Saying
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="shrink-0">Rated {averageRating}</p>
            <img src="/stars.svg" className="h-6" />

            <p className="shrink-0">based on {"500+"} reviews on</p>

            <img src="/Yotpo.png" className="w-8" />
          </div>
        </div>
        <Slider slides={slideData} />
      </div>
    </div>
  );
}
