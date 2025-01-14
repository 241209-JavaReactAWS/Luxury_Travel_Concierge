package com.revature.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Set;

@Entity
@Table(name = "admin",schema="public")
public class Admin {
    @Column(name="adminId")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int adminId;
    @Column (name="username",unique = true,nullable = false)
    private String username;
    @Column (name="password",nullable = false)
    private String password;
    @Column (name="email")
    private String email;
    @Column (name="firstName",nullable = false)
    private String firstName;
    @Column (name="lastName",nullable = false)
    private String lastName;
    @JsonManagedReference(value="admin_hotel")
    @OneToMany(mappedBy = "admin")
    private Set<Hotel> ownedHotels;
    private String description;
    public Admin() {
    }

    public Admin(int adminId, String username, String password, String email, String firstName, String lastName, String description, Set<Hotel> ownedHotels) {
        this.adminId = adminId;
        this.username = username;
        this.password = password;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.description = description;
        this.ownedHotels = ownedHotels;
    }

    public Set<Hotel> getOwnedHotels() {
        return ownedHotels;
    }

    public void setOwnedHotels(Set<Hotel> ownedHotels) {
        this.ownedHotels = ownedHotels;
    }

    public int getAdminId() {
        return adminId;
    }

    public void setAdminId(int adminId) {
        this.adminId = adminId;
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

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
