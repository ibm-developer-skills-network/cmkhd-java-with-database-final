package com.project.code.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import com.project.code.Model.CombinedRequest;
import com.project.code.Model.Inventory;
import com.project.code.Model.PlaceOrderRequestDTO;
import com.project.code.Model.Product;
import com.project.code.Model.Store;
import com.project.code.Repo.InventoryRepository;
import com.project.code.Repo.ProductRepository;
import com.project.code.Repo.StoreRepository;
import com.project.code.Service.OrderService;
import com.project.code.Service.ServiceClass;

@RestController
public class Controller {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private StoreRepository storeRepository;
    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ServiceClass serviceClass;

    @Autowired
    private OrderService orderService;


    @PostMapping("/admin/addStore")
    @CrossOrigin(origins = "*", methods = { RequestMethod.POST })
    public Map<String, String> addStore(@RequestBody Store store) {
        storeRepository.save(store);
        Map<String, String> map = new HashMap<>();
        map.put("message", "Store added successfully");
        return map;
    }


    @PostMapping("/storeManager/addProduct")
    @CrossOrigin(origins = "*", methods = { RequestMethod.POST })
    public Map<String, String> addProduct(@RequestBody Product product) {

        Map<String, String> map = new HashMap<>();
        if (!serviceClass.validateProduct(product)) {
            map.put("message", "Product already present in database");
            return map;
        }
        try{
            productRepository.save(product);
            map.put("message", "Product added successfully");
        }
        
        catch (DataIntegrityViolationException e) {
            map.put("message","SKU should be unique");
        }
        return map;
    }


    @GetMapping("/storeManager/viewProduct/{id}")
    @CrossOrigin(origins = "*", methods = { RequestMethod.GET })
    public Map<String, Object> getProductbyId(@PathVariable Long id) {
        Map<String, Object> map = new HashMap<>();

        Product result = productRepository.findByid(id);
        map.put("products", result);
        return map;
    }

    @CrossOrigin(origins = "*", methods = { RequestMethod.PUT })
    @PutMapping("/storeManager/updateProduct")
    public Map<String, String> updateProduct(@RequestBody CombinedRequest request) 
    {
        Product product = request.getProduct();
        Inventory inventory=request.getInventory();


        System.out.println(product.toString());
        System.out.println("product: "+inventory.toString());
      
        Map<String, String> map = new HashMap<>();
        System.out.println("Stock Level: " + inventory.getStockLevel());
        if (!serviceClass.ValidateProductId(product.getId())) {
            map.put("message", "Id " +product.getId() + " not present in database");
            return map;
        }
        productRepository.save(product);
        map.put("message", "Successfully updated product with id: " + product.getId());

        if (inventory != null) {
            try {
                Inventory result = serviceClass.getInventoryId(inventory);
                if (result != null) {
                    inventory.setId(result.getId());
                    inventoryRepository.save(inventory);
                } else {
                    map.put("message", "No data available for this product or store id");
                    return map;
                }

            } catch (DataIntegrityViolationException e) {
                map.put("message", "Error: " + e);
                System.out.println(e);
                return map;
            } catch (Exception e) {
                map.put("message", "Error: " + e);
                System.out.println(e);
                return map;
            }
        }

        return map;

    }



    @PostMapping("/storeManager/addProductToInventory")
    @CrossOrigin(origins = "*", methods = { RequestMethod.GET, RequestMethod.POST })
    public Map<String, String> saveInventory(@RequestBody Inventory inventory) {

        Map<String, String> map = new HashMap<>();
        try {
            if (serviceClass.validateInventory(inventory)) {
                inventoryRepository.save(inventory);
            } else {
                map.put("message", "Data Already present in inventory");
                return map;
            }

        } catch (DataIntegrityViolationException e) {
            map.put("message", "Error: " + e);
            System.out.println(e);
            return map;
        } catch (Exception e) {
            map.put("message", "Error: " + e);
            System.out.println(e);
            return map;
        }
        map.put("message", "Product added to inventory successfully");
        return map;
    }



    @GetMapping("/warehouseManager/viewProduct/{id}")
    @CrossOrigin(origins = "*", methods = { RequestMethod.GET })
    public Map<String, Object> getAllProducts(@PathVariable Long id) {
        Map<String, Object> map = new HashMap<>();
        List<Product> result = productRepository.findProductsByStoreId(id);
        map.put("products", result);
        return map;
    }


    @GetMapping("/warehouseManager/viewProductName/{name}/{storeid}")
    @CrossOrigin(origins = "*", methods = { RequestMethod.GET })
    public Map<String, Object> getProductName(@PathVariable String name,@PathVariable long storeid) {
        Map<String, Object> map = new HashMap<>();
        List<Product> result = productRepository.findByNameLike(storeid,name);
        map.put("product", result);
        return map;
    }

    @GetMapping("/warehouseManager/viewProductbyCategory/{category}/{storeid}")
    @CrossOrigin(origins = "*", methods = { RequestMethod.GET })
    public Map<String, Object> getProductbyCategory(@PathVariable String category,@PathVariable long storeid) {
        Map<String, Object> map = new HashMap<>();
       List<Product> result = productRepository.findProductByCategory(category,storeid);

       map.put("product", result);
        return map;
    }



    @GetMapping("/getAllProducts")
    @CrossOrigin(origins = "*", methods = { RequestMethod.GET })
    public Map<String, Object> listProduct() {
        
        Map<String, Object> map = new HashMap<>();
        map.put("products",productRepository.findAll());
        return map;
    }


    @DeleteMapping("/admin/deleteProduct/{id}")
    @CrossOrigin(origins = "*", methods = { RequestMethod.DELETE })
    public Map<String, String> deleteProduct(@PathVariable Long id) {
        Map<String, String> map = new HashMap<>();

        if (!serviceClass.ValidateProductId(id)) {
            map.put("message", "Id " + id + " not present in database");
            return map;
        }
        inventoryRepository.deleteByProductId(id);
        productRepository.deleteById(id);
        map.put("message", "Deleted product successfully with id: " + id);
        return map;
    }

    @DeleteMapping("/removeProductFromInventory/{id}")
    @CrossOrigin(origins = "*", methods = { RequestMethod.DELETE })
    public Map<String, String> removeProduct(@PathVariable Long id) {
        Map<String, String> map = new HashMap<>();

        if (!serviceClass.ValidateProductId(id)) {
            map.put("message", "Id " + id + " not present in database");
            return map;
        }
        inventoryRepository.deleteByProductId(id);
        map.put("message", "Deleted product successfully with id: " + id);
        return map;
    }

    @GetMapping("/searchProduct/{name}")
    @CrossOrigin(origins = "*", methods = { RequestMethod.GET })
    public Map<String, Object> searchProduct(@PathVariable String name) 
    {
        Map<String, Object> map = new HashMap<>();
        map.put("products",productRepository.findProductBySubName(name));
        return map;
    }

    @PutMapping("/updateProduct")
    @CrossOrigin(origins = "*", methods = { RequestMethod.PUT })
    public Map<String, String> searchProduct(@RequestBody Product product) 
    {
        Map<String, String> map = new HashMap<>();
        try{
            productRepository.save(product);
            map.put("message","Data upated sucessfully");
        }
        catch(Error e)
        {
            map.put("message","Error occured");
        }
        
        return map;
    }
    
    @GetMapping("getProductbyCategory/{category}")
    @CrossOrigin(origins = "*", methods = { RequestMethod.GET })
    public Map<String, Object> filterbyCategoryProduct(@PathVariable String category) 
    {
        Map<String, Object> map = new HashMap<>();
        map.put("products",productRepository.findByCategory(category));
        return map;
    }


    @GetMapping("validateStoreId/{storeId}")
    @CrossOrigin(origins = "*", methods = { RequestMethod.GET })
    public boolean validateStore(@PathVariable Long storeId ) 
    {
        Store store=storeRepository.findByid(storeId);
        if(store!=null)
        {
            return true;
        }
        return false;
    }



    @PostMapping("/placeOrder")
    @CrossOrigin(origins = "*", methods = { RequestMethod.POST })
    public Map<String,String> placeOrder(@RequestBody PlaceOrderRequestDTO placeOrderRequest) {
    
        Map<String,String> map=new HashMap<>();
        try{
        orderService.saveOrder(placeOrderRequest);
        map.put("message","Data Saved successfully");
        }
        catch(Error e)
        {
            map.put("Error",""+e);
            
        }
        return map;  
    }

    @GetMapping("/validateQuantity/{quantity}/{storeId}/{productId}")
    @CrossOrigin(origins = "*",methods ={RequestMethod.GET})
    public boolean validateQuantity(@PathVariable int quantity, @PathVariable long storeId, @PathVariable long productId)
    {
        Inventory result = inventoryRepository.findByProductIdandStoreId(productId, storeId);
        if(result.getStockLevel()>=quantity)
        {
            return true;
        }
        return false;
        
    }

    
}


