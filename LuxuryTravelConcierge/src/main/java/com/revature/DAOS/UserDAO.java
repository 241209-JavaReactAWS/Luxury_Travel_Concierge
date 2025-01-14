package com.revature.DAOS;

import com.revature.models.Hotel;
import com.revature.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface UserDAO extends JpaRepository<User, Integer> {
    public Optional<User> findUserByUsername(String username);

    @Query("SELECT h FROM Hotel h JOIN h.favoritedBy u WHERE u.username = :username")
    Set<Hotel> findFavoritesByUsername(@Param("username") String username);
//    public List<Hotel> findFavoritesByUsername(String username);
}
