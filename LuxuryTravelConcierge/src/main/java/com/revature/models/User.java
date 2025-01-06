package com.revature.models;

import jakarta.persistence.*;

import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userId;

    private String username;

    private String password;

    private String email;

    private String address;

    private String first_name;

    private String last_name;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "favourite",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "hotelId")
    )
    private Set<Hotel> favorites;

    public User() {
    }

    public User(Set<Hotel> favorites) {
        this.favorites = favorites;
    }

    public User(int userId, String username, String password, String email, String address, String first_name, String last_name) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.email = email;
        this.address = address;
        this.first_name = first_name;
        this.last_name = last_name;
    }

    public Set<Hotel> getFavorites() {
        return favorites;
    }

    public void setFavorites(Set<Hotel> favorites) {
        this.favorites = favorites;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }
}
