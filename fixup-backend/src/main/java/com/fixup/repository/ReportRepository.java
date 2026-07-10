package com.fixup.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.fixup.model.Report;
import com.fixup.model.User;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
       List<Report> findByProvider(User provider);
}
