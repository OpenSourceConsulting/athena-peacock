package com.athena.peacock.controller.common.exception;

import javax.servlet.http.HttpServletRequest;

import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;

/**
 * 
 * 전역 Exception Handler
 * @author Bong-Jin Kwon
 *
 */
@ControllerAdvice
class GlobalDefaultExceptionHandler {
	
    public static final String DEFAULT_ERROR_VIEW = "error";

    @ExceptionHandler(value = Exception.class)
    public ModelAndView defaultErrorHandler(HttpServletRequest req, Exception e) throws Exception {
        // If the exception is annotated with @ResponseStatus rethrow it and let
        // the framework handle it - like the OrderNotFoundException example
        // at the start of this post.
        // AnnotationUtils is a Spring Framework utility class.
        if (AnnotationUtils.findAnnotation(e.getClass(), ResponseStatus.class) != null)
            throw e;

        // Otherwise setup and send the user to a default error-view.
        ModelAndView mav = new ModelAndView();
        //mav.addObject("exception", e);
        //mav.addObject("url", req.getRequestURL());
        //mav.setViewName(DEFAULT_ERROR_VIEW);
        
        mav.addObject("success", false);
        mav.addObject("msg", req.getRequestURL() + "\r\n" + e.toString());
        
        return mav;
    }
}