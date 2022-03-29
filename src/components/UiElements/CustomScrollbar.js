import clsx from "clsx";
import { throttle, debounce, clamp } from "lodash-es";
import React, {
  forwardRef,
  useRef,
  useCallback,
  useEffect,
  useState,
  useMemo,
  useImperativeHandle,
} from "react";

var index = "";

const Thumb = forwardRef(({ wrapperEl, scrollInfoRef, ...props }, ref) => {
  const thumbEl = useRef(null);
  const pointerDownInfo = useRef({ pageX: 0, pageY: 0, scrollPos: 0 });
  const pointerId = useRef(null);
  const autoHideTimer = useRef(null);
  const startAutoHideTimer = useCallback(() => {
    autoHideTimer.current = setTimeout(() => {
      if (thumbEl.current)
        thumbEl.current.classList.remove(
          "scrollbar__thumbPlaceholder--scrolling"
        );
      autoHideTimer.current = null;
    }, props.autoHideDelay);
  }, [props.autoHideDelay]);
  const clearAutoHideTimer = useCallback(() => {
    if (autoHideTimer.current !== null) clearTimeout(autoHideTimer.current);
  }, []);
  useEffect(() => clearAutoHideTimer, []);
  const handlePointerMove = useCallback(
    throttle((evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      const moveDirection = props.type === "horizontal" ? "pageX" : "pageY";
      const moveDistance =
        ((evt[moveDirection] - pointerDownInfo.current[moveDirection]) /
          scrollInfoRef.current.wrapperMainSize) *
        scrollInfoRef.current.contentMainSize;
      wrapperEl.current.scrollTo({
        [props.type === "horizontal" ? "left" : "top"]:
          pointerDownInfo.current.scrollPos + moveDistance,
        behavior: "auto",
      });
    }, 16),
    []
  );
  const handlePointerEnd = useCallback(() => {
    startAutoHideTimer();
    thumbEl.current.removeEventListener("pointermove", handlePointerMove);
    thumbEl.current.removeEventListener("pointerup", handlePointerEnd);
    thumbEl.current.removeEventListener("pointercancel", handlePointerEnd);
    thumbEl.current.removeEventListener("mousewheel", handlePointerEnd);
    document.removeEventListener("mousewheel", handlePointerEnd);
    if (typeof pointerId.current === "number")
      thumbEl.current.releasePointerCapture(pointerId.current);
    pointerId.current = null;
  }, [props.autoHideDelay, startAutoHideTimer]);
  const handlePointerDown = useCallback((evt) => {
    evt.stopPropagation();
    if (evt.ctrlKey || evt.button !== 0) return;
    clearAutoHideTimer();
    pointerDownInfo.current.pageX = evt.pageX;
    pointerDownInfo.current.pageY = evt.pageY;
    pointerDownInfo.current.scrollPos =
      wrapperEl.current[
        props.type === "horizontal" ? "scrollLeft" : "scrollTop"
      ];
    pointerId.current = evt?.pointerId;
    thumbEl.current.setPointerCapture(pointerId.current);
    thumbEl.current.addEventListener("pointermove", handlePointerMove);
    thumbEl.current.addEventListener("pointerup", handlePointerEnd);
    thumbEl.current.addEventListener("pointercancel", handlePointerEnd);
    thumbEl.current.addEventListener("mousewheel", handlePointerEnd, {
      passive: false,
    });
    document.addEventListener("mousewheel", handlePointerEnd, {
      passive: false,
    });
    thumbEl.current.classList.add("scrollbar__thumbPlaceholder--scrolling");
  }, []);
  const [isWrapperIntersecting, setWrapperIntersecting] = useState(false);
  const [isShepherdIntersecting, setShepherdIntersecting] = useState(false);
  const shepherdEl = useRef(null);
  const shouldFixed = useMemo(
    () => props.fixed && !isShepherdIntersecting,
    [props.fixed, isShepherdIntersecting]
  );
  useEffect(() => {
    if (!props.fixed) return;
    let shepherdIO = null;
    let wrapperIO = null;
    const shepherdIOCallback = ([entry]) =>
      setShepherdIntersecting(entry.isIntersecting);
    const wrapperIOCallback = ([entry]) =>
      setWrapperIntersecting(entry.isIntersecting);
    wrapperIO = new IntersectionObserver(wrapperIOCallback, {
      threshold: [0, 0.5],
    });
    wrapperIO.observe(wrapperEl.current);
    shepherdIO = new IntersectionObserver(shepherdIOCallback);
    shepherdIO.observe(shepherdEl.current);
    return () => {
      if (autoHideTimer.current !== null) clearTimeout(autoHideTimer.current);
      if (shepherdIO) {
        shepherdIO.disconnect();
        shepherdIO = null;
      }
      if (wrapperIO) {
        wrapperIO.disconnect();
        wrapperIO = null;
      }
    };
  }, [props.fixed]);
  const autoHideAfterScroll = useCallback(() => {
    clearAutoHideTimer();
    if (thumbEl.current)
      thumbEl.current.classList.add("scrollbar__thumbPlaceholder--scrolling");
    startAutoHideTimer();
  }, [props.autoHideDelay, startAutoHideTimer]);
  useImperativeHandle(ref, () => ({ autoHideAfterScroll }));
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      {
        className: clsx(
          "scrollbar__thumbPlaceholder",
          `scrollbar__thumbPlaceholder--${props.type}`,
          {
            ["scrollbar__thumbPlaceholder--visible"]:
              Boolean(props.scrollInfo.thumbSize) &&
              (props.fixed ? isWrapperIntersecting : true),
            ["scrollbar__thumbPlaceholder--autoHide"]: props.autoHide,
            ["scrollbar__thumbPlaceholder--autoExpand"]: props.autoExpand,
          }
        ),
        style: {
          width:
            props.type === "horizontal"
              ? `${props.scrollInfo.thumbSize}px`
              : "",
          height:
            props.type === "vertical" ? `${props.scrollInfo.thumbSize}px` : "",
          position: !shouldFixed ? "absolute" : "fixed",
          [props.type === "vertical" ? "top" : "left"]: !shouldFixed
            ? "3px"
            : `${props.scrollInfo.boundaryDistance + 3}px`,
        },
        ref: thumbEl,
        onPointerDown: handlePointerDown,
      },
      React.createElement("div", {
        className: clsx("scrollbar__thumb", `scrollbar__thumb--${props.type}`),
      })
    ),
    props.fixed &&
      React.createElement("div", {
        ref: shepherdEl,
        className: clsx(
          "scrollbar__shepherd",
          `scrollbar__shepherd--${props.type}`,
          Boolean(props.scrollInfo.thumbSize) && "scrollbar__shepherd--visible"
        ),
      })
  );
});

const defaultOption = {
  wait: 333,
  type: "debounce",
};
function useMeasure(...args) {
  const hasParamRef = "current" in args?.[0];
  const xxx = useRef(null);
  let option;
  if (hasParamRef) option = args?.[1];
  else option = args?.[0];
  const { wait, type, callback } = { ...defaultOption, ...option };
  const targetRef = hasParamRef ? args[0] : xxx;
  const [rect, setRect] = useState(() => ({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  }));
  const observerFunc = useCallback(() => {
    if (targetRef?.current) {
      const domRect = targetRef.current.getBoundingClientRect();

      setRect({
        left: domRect.left,
        top: domRect.top,
        right: domRect.right,
        bottom: domRect.bottom,
        width: domRect.width,
        height: domRect.height,
        x: domRect.x,
        y: domRect.y,
      });
      callback?.();
    }
  }, []);
  let execFunc = useRef(null);
  let ro = null;
  const clearRo = useCallback(() => {
    if (execFunc.current)
      window.removeEventListener("resize", execFunc.current);
    if (!ro) return;
    ro.disconnect();
    ro = null;
  }, []);
  useEffect(() => {
    if (!targetRef.current) return clearRo;
    execFunc.current = observerFunc;
    if (type === "throttle" && wait >= 4)
      execFunc.current = throttle(execFunc.current, wait);
    else if (type === "debounce" && wait >= 4)
      execFunc.current = debounce(execFunc.current, wait);
    window.addEventListener("resize", execFunc.current);
    ro = new ResizeObserver(execFunc.current);
    ro.observe(targetRef.current);
    return clearRo;
  }, [targetRef.current]);
  if (hasParamRef) return rect;
  return [targetRef, rect];
}

function composeRef() {
  let refs;
  if (arguments.length === 1 && arguments[0] instanceof Array)
    refs = arguments[0];
  else refs = Array.from(arguments);
  return (ref) => {
    refs.forEach((r) => {
      if (r !== null && typeof r === "object" && "current" in r)
        r.current = ref;
      if (typeof r === "function") r(ref);
    });
  };
}

const CustomScrollbar = forwardRef(
  (
    {
      children,
      className,
      style,
      contentClassName,
      contentStyle,
      direction = "vertical",
      autoHide = true,
      autoHideDelay = 900,
      autoExpand = true,
      throttleType = "debounce",
      throttleWait = 333,
      fixedThumb,
      thumbMinSize = 48,
      thumbMaxSize = Infinity,
      simulateScroll,
      onWrapperResize,
      onContentResize,
      onScroll,
      ...nativeProps
    },
    _forwardRef
  ) => {
    const thumbs = useRef({
      horizontal: { el: null, methods: null },
      vertical: { el: null, methods: null },
    });
    useEffect(() => {
      const childNodes = Array.from(
        wrapperEl.current.parentElement?.childNodes
      );
      for (const thumbType in thumbs.current) {
        thumbs.current[thumbType].el = childNodes.find((ele) =>
          ele?.classList?.contains(`scrollbar__thumbPlaceholder--${thumbType}`)
        );
      }
    }, []);
    const [nativeMaxScrollTop, setNativeMaxScrollTop] = useState(0);
    const [nativeMaxScrollLeft, setNativeMaxScrollLeft] = useState(0);
    const wrapperEl = useRef(null);
    const updateMaxScrollDistance = useCallback(() => {
      let newMaxScrollTop = Math.max(
        (wrapperEl.current.scrollHeight - wrapperEl.current.clientHeight) | 0,
        0
      );
      let newMaxScrollLeft = Math.max(
        (wrapperEl.current.scrollWidth - wrapperEl.current.clientWidth) | 0,
        0
      );
      setNativeMaxScrollTop(newMaxScrollTop);
      setNativeMaxScrollLeft(newMaxScrollLeft);
    }, []);
    const wrapperRect = useMeasure(wrapperEl, {
      wait: throttleWait,
      type: throttleType,
      callback: updateMaxScrollDistance,
    });
    const [contentEl, contentRect] = useMeasure({
      wait: throttleWait,
      type: throttleType,
      callback: updateMaxScrollDistance,
    });

    useEffect(() => onWrapperResize?.(wrapperRect), [wrapperRect]);
    useEffect(() => onContentResize?.(contentRect), [contentRect]);
    const scrollWidthInfoRef = useRef({
      thumbSize: 0,
      contentMainSize: 0,
      wrapperMainSize: 0,
      boundaryDistance: 0,
    });
    const scrollWidthInfo = useMemo(() => {
      const res = {
        thumbSize: nativeMaxScrollLeft
          ? clamp(
              (wrapperRect.width / wrapperEl.current.scrollWidth) *
                wrapperRect.width,
              thumbMinSize > wrapperRect.width ? 48 : thumbMinSize,
              thumbMaxSize
            )
          : 0,
        contentMainSize: contentRect.width,
        wrapperMainSize: wrapperRect.width,
        boundaryDistance: wrapperRect.left,
      };
      Object.assign(scrollWidthInfoRef.current, res);
      return res;
    }, [
      nativeMaxScrollLeft,
      wrapperRect.width,
      thumbMinSize,
      thumbMaxSize,
      contentRect.width,
      wrapperRect.left,
    ]);
    const scrollHeightInfoRef = useRef({
      thumbSize: 0,
      contentMainSize: 0,
      wrapperMainSize: 0,
      boundaryDistance: 0,
    });
    const scrollHeightInfo = useMemo(() => {
      const res = {
        thumbSize: nativeMaxScrollTop
          ? clamp(
              (wrapperRect.height / wrapperEl.current.scrollHeight) *
                wrapperRect.height,
              thumbMinSize > wrapperRect.height ? 48 : thumbMinSize,
              thumbMaxSize
            )
          : 0,
        contentMainSize: contentRect.height,
        wrapperMainSize: wrapperRect.height,
        boundaryDistance: wrapperRect.top,
      };
      Object.assign(scrollHeightInfoRef.current, res);
      return res;
    }, [
      nativeMaxScrollTop,
      wrapperRect.height,
      thumbMinSize,
      thumbMaxSize,
      contentRect.height,
      wrapperRect.top,
    ]);
    const maxScrollInfo = useRef({
      native: { top: 0, left: 0 },
      custom: { top: 0, left: 0 },
    });
    useEffect(() => {
      maxScrollInfo.current.custom.left =
        wrapperRect.width - scrollWidthInfo.thumbSize - 5;
    }, [wrapperRect.width, scrollWidthInfo.thumbSize]);
    useEffect(() => {
      maxScrollInfo.current.custom.top =
        wrapperRect.height - scrollHeightInfo.thumbSize - 5;
    }, [wrapperRect.height, scrollHeightInfo.thumbSize]);
    useEffect(() => {
      maxScrollInfo.current.native.left = nativeMaxScrollLeft;
    }, [nativeMaxScrollLeft]);
    useEffect(() => {
      maxScrollInfo.current.native.top = nativeMaxScrollTop;
    }, [nativeMaxScrollTop]);
    const handleScroll = useCallback((evt) => {
      if (maxScrollInfo.current.native.left) {
        thumbs.current.horizontal.el.style.transform = `translate3d(${
          (wrapperEl.current.scrollLeft / maxScrollInfo.current.native.left) *
          maxScrollInfo.current.custom.left
        }px, 0, 0)`;
        thumbs.current.horizontal.methods.autoHideAfterScroll();
      }
      if (maxScrollInfo.current.native.top) {
        thumbs.current.vertical.el.style.transform = `translate3d(0, ${
          (wrapperEl.current.scrollTop / maxScrollInfo.current.native.top) *
          maxScrollInfo.current.custom.top
        }px, 0)`;
        thumbs.current.vertical.methods.autoHideAfterScroll();
      }
      if (evt) onScroll?.(evt);
    }, []);
    useEffect(() => {
      if (!thumbs.current.vertical.el) return;
      handleScroll(void 0);
    }, [nativeMaxScrollLeft, nativeMaxScrollTop]);
    const handleSimulateScroll = useCallback((evt) => {
      evt.stopPropagation();
      const preScrollLeft = wrapperEl.current.scrollLeft;
      const preScrollTop = wrapperEl.current.scrollTop;
      const newScrollLeft =
        clamp(preScrollLeft + (evt?.deltaX || 0), 0, nativeMaxScrollLeft) | 0;
      const newScrollTop =
        clamp(preScrollTop + (evt?.deltaY || 0), 0, nativeMaxScrollTop) | 0;
      wrapperEl.current.scrollLeft = newScrollLeft;
      wrapperEl.current.scrollTop = newScrollTop;
      if (nativeMaxScrollLeft) {
        thumbs.current.horizontal.el.style.transform = `translate3d(${
          (newScrollLeft / maxScrollInfo.current.native.left) *
          maxScrollInfo.current.native.left
        }px, 0, 0)`;
        thumbs.current.horizontal.methods.autoHideAfterScroll();
      }
      if (nativeMaxScrollTop) {
        thumbs.current.vertical.el.style.transform = `translate3d(0, ${
          (newScrollTop / maxScrollInfo.current.native.top) *
          maxScrollInfo.current.native.top
        }px, 0)`;
        thumbs.current.vertical.methods.autoHideAfterScroll();
      }
    }, []);
    return React.createElement(
      "div",
      { className: "scrollbar__wrapper" },
      React.createElement(
        "div",
        {
          ref: composeRef(wrapperEl, _forwardRef),
          ...nativeProps,
          className: clsx("scrollbar__scroller", className),
          style,
          onScroll: simulateScroll ? void 0 : handleScroll,
          onWheel: simulateScroll ? handleSimulateScroll : void 0,
        },
        React.createElement(
          "div",
          {
            ref: contentEl,
            className: clsx(
              "scrollbar__content",
              direction && `scrollbar__content--${direction}`,
              contentClassName,
              fixedThumb && "scrollbar__content--fixedThumb"
            ),
            style: contentStyle,
          },
          children
        )
      ),
      Object.entries(thumbs.current).map(([thumbType, thumb]) =>
        React.createElement(Thumb, {
          ref: (methods) => (thumb.methods = methods),
          key: thumbType,
          type: thumbType,
          autoExpand,
          autoHide,
          autoHideDelay,
          fixed: thumbType === direction ? false : !!fixedThumb,
          scrollInfo:
            thumbType === "vertical" ? scrollHeightInfo : scrollWidthInfo,
          scrollInfoRef:
            thumbType === "vertical" ? scrollHeightInfoRef : scrollWidthInfoRef,
          wrapperEl,
        })
      )
    );
  }
);

export { CustomScrollbar as default, useMeasure };
