package com.smartmeal.repository;
import com.smartmeal.model.WeightEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface WeightEntryRepository extends JpaRepository<WeightEntry, Long> {
    List<WeightEntry> findByUserIdOrderByDateAsc(Long userId);
}
