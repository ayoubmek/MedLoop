package com.medloop.admin.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatisticsDTO {

    private long totalHospitals;
    private long totalDoctors;
    private long totalPatients;
    private long activeDoctors;
    private long activePatients;
    private long totalBeds;
    private long availableBeds;
    private double bedOccupancyRate;
}
