package com.revature.exceptions;

public class NoUserFoundException extends RuntimeException {
  public NoUserFoundException(String message) {
    super(message);
  }
}
