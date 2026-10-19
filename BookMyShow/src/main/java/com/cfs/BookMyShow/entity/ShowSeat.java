package com.cfs.BookMyShow.entity;

import jakarta.persistence.*;

@Entity
@Table(name="show_seats",uniqueConstraints = @UniqueConstraint(name = "uk_Show_seat",columnNames = {"show_id","seatLabel"}))
public class ShowSeat {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    private Show show;


    private String seatLabel;

    private boolean reserved;

    public ShowSeat()
    {

    }

    public ShowSeat(Show show, String seatLabel) {
        this.show = show;
        this.seatLabel = seatLabel;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSeatLabel()
    {
        return  seatLabel;
    }
    public boolean isReserved()
    {
        return reserved;
    }

    public void reserve()
    {
        reserved=true;
    }

    public void release()
    {
        reserved=false;
    }

}
