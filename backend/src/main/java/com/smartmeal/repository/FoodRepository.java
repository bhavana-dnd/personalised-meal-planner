package com.smartmeal.repository;
import com.smartmeal.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;
public interface FoodRepository extends JpaRepository<Food, Long> {
    List<Food> findByCategory(String category);
    @Query("SELECT f FROM Food f WHERE LOWER(f.name) LIKE LOWER(CONCAT('%',:q,'%')) OR LOWER(f.category) LIKE LOWER(CONCAT('%',:q,'%'))")
    List<Food> search(@Param("q") String query);
    List<Food> findByIsPoshanMealTrue();
    List<Food> findByIsPoshanMealTrueAndPoshanState(String state);
    @Query("SELECT f FROM Food f WHERE f.visionLabels IS NOT NULL AND LOWER(f.visionLabels) LIKE LOWER(CONCAT('%',:label,'%'))")
    List<Food> findByVisionLabel(@Param("label") String label);
    Optional<Food> findByNameIgnoreCase(String name);
}
