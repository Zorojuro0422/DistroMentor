package com.group29.distromentorsystem.services.login;

import com.group29.distromentorsystem.models.Dealer;
import com.group29.distromentorsystem.models.Distributor;
import com.group29.distromentorsystem.models.Employee;
import com.group29.distromentorsystem.repositories.DealerRepository;
import com.group29.distromentorsystem.repositories.DistributorRepository;
import com.group29.distromentorsystem.repositories.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SignInServiceImpl implements SignInService{

    @Autowired
    private DealerRepository dealerRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DistributorRepository distributorRepository;

    @Override
    public Map<String, Object> findEntityInfoById(String userId){
        Map<String, Object> result = new HashMap<>();

        Dealer dealer = (Dealer) dealerRepository.findById(userId).orElse(null);
        Employee employee = (Employee) employeeRepository.findById(userId).orElse(null);

        if(dealer != null){
            result.put("userId", dealer.getDealerid());
            result.put("tableName", "Dealer");
        } else if (employee != null) {
            result.put("userId", employee.getEmployeeid());
            result.put("tableName", "Employee");
        } else {
            result.put("userId", null);
            result.put("tableName", "Error");
        }

        return result;
    }


    @Override
    public Map<String, Object> findEntityInfoById(Map<String, String> loginData) {
        Map<String, Object> result = new HashMap<>();

        String userId = loginData.get("userId");
        String password = loginData.get("password");


        Distributor distributor = distributorRepository.findById(userId).orElse(null);
        Dealer dealer = dealerRepository.findById(userId).orElse(null);
        Employee employee = employeeRepository.findById(userId).orElse(null);



        if (dealer != null && dealer.getPassword().equals(password) && dealer.getIsconfirmed().equals(true)) {
            result.put("userId", dealer.getDealerid());
            result.put("tableName", "Dealer");
            result.put("dealer", dealer);
        } else if (distributor != null && distributor.getPassword().equals(password)) {
            result.put("userId", distributor.getDistributorid());
            result.put("tableName", "Distributor");
            result.put("distributor", distributor);
        } else if (employee != null && employee.getPassword().equals(password)) {
            if (employee.isIssalesassociate() && employee.isIscashier()) {
                result.put("userId", employee.getEmployeeid());
                result.put("tableName", "Sales Associate and Cashier");
                result.put("salesAssociateAndCashier", employee);
            } else if (employee.isIssalesassociate()) {
                result.put("userId", employee.getEmployeeid());
                result.put("tableName", "Sales Associate");
                result.put("salesAssociate", employee);
            } else if (employee.isIscashier()) {
                result.put("userId", employee.getEmployeeid());
                result.put("tableName", "Cashier");
                result.put("cashier", employee);
            }
        } else {
                result.put("userId", null);
                result.put("tableName", "Error");
        }
        return result;
    }
}
