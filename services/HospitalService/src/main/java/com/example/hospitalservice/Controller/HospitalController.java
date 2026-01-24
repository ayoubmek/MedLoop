package com.example.hospitalservice.Controller;

import com.example.hospitalservice.entities.Hospital;
import com.example.hospitalservice.entities.MedicalService;
import com.example.hospitalservice.service.HospitalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {
    private final HospitalService hospitalService;

    @Autowired
    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Hospital>> getAllHospitals() {
        return ResponseEntity.ok(hospitalService.getAllHospitals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hospital> getHospitalById(@PathVariable Long id) {
        return ResponseEntity.ok(hospitalService.getHospitalById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<Hospital> createHospital(@Valid @RequestBody Hospital hospital) {
        return new ResponseEntity<>(hospitalService.createHospital(hospital), HttpStatus.CREATED);
    }
    @GetMapping("/{id}/services")
    public ResponseEntity<List<MedicalService>> getHospitalServices(@PathVariable Long id) {
        return ResponseEntity.ok(hospitalService.getHospitalServices(id));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<Hospital> updateHospital(@PathVariable Long id, @Valid @RequestBody Hospital hospitalDetails) {
        return ResponseEntity.ok(hospitalService.updateHospital(id, hospitalDetails));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteHospital(@PathVariable Long id) {
        hospitalService.deleteHospital(id);
        return ResponseEntity.noContent().build();
    }
}
