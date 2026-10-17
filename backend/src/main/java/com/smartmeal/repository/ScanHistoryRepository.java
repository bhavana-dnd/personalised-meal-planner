package com.smartmeal.repository;
import com.smartmeal.model.ScanHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ScanHistoryRepository extends JpaRepository<ScanHistory, Long> {
    List<ScanHistory> findByUserIdOrderByScannedAtDesc(Long userId);
}
