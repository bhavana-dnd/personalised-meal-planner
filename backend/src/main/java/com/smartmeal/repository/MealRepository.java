package com.smartmeal.repository;
import com.smartmeal.model.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findByUserIdAndDateOrderByLoggedAtDesc(Long userId, LocalDate date);
    List<Meal> findByUserIdAndDateBetweenOrderByDateAsc(Long userId, LocalDate start, LocalDate end);
    @Query("SELECT COALESCE(SUM(m.totalCalories),0) FROM Meal m WHERE m.user.id=:uid AND m.date=:date")
    double sumCalories(@Param("uid") Long userId, @Param("date") LocalDate date);
    @Query("SELECT COALESCE(SUM(m.totalProtein),0) FROM Meal m WHERE m.user.id=:uid AND m.date=:date")
    double sumProtein(@Param("uid") Long userId, @Param("date") LocalDate date);
    @Query("SELECT COALESCE(SUM(m.totalCarbs),0) FROM Meal m WHERE m.user.id=:uid AND m.date=:date")
    double sumCarbs(@Param("uid") Long userId, @Param("date") LocalDate date);
    @Query("SELECT COALESCE(SUM(m.totalFat),0) FROM Meal m WHERE m.user.id=:uid AND m.date=:date")
    double sumFat(@Param("uid") Long userId, @Param("date") LocalDate date);
}
