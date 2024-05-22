package com.group29.distromentorsystem.services;


import com.group29.distromentorsystem.repositories.DistributorDocumentRepository;
import com.group29.distromentorsystem.models.DistributorDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DistributorDocumentService {

    @Autowired
    DistributorDocumentRepository distributorDocumentRepository;

    public DistributorDocument createDistributorDocument(String documentid, String name, String type, MultipartFile content, String dealer){
        DistributorDocument document = new DistributorDocument();
        /*document.setDocumentid(documentid);
        document.setName(name);
        document.setType(type);
        document.setDealer(dealer);
        try {
            document.setContent(content.getBytes());
        } catch (IOException e) {
            System.err.println("Error reading file bytes for attachment: " + document.getName());
            e.printStackTrace();

        }*/

        return distributorDocumentRepository.save(document);
    }

    public Iterable<DistributorDocument> findAllDocumentsByDistributorId(String distributorid){
        return distributorDocumentRepository.findByDistributor_Distributorid(distributorid);
    }
}
